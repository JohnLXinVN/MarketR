import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/logs-feature/log.entity';
import { User } from 'src/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import { LogOrder } from './log-order.entity';
import { QueryLogOrdersDto } from './dto/query-log-orders.dto';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class LogsOrderService {
  private readonly logger = new Logger(LogsOrderService.name);

  constructor(
    @InjectRepository(Log) private logsRepository: Repository<Log>,
    @InjectRepository(User) private usersRepository: Repository<User>,

    @InjectRepository(LogOrder)
    private logOrdersRepository: Repository<LogOrder>,

    private dataSource: DataSource,
  ) {}

  async findForUser(userId: number, queryDto: QueryLogOrdersDto) {
    const { page = 1, limit = 10 } = queryDto;

    const queryBuilder =
      this.logOrdersRepository.createQueryBuilder('logOrder');

    // Dùng leftJoinAndSelect để lấy cả thông tin của 'log'
    queryBuilder
      .leftJoinAndSelect('logOrder.log', 'log')
      .where('logOrder.userId = :userId', { userId })
      .orderBy('logOrder.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  // HÀM MỚI: Xử lý logic mua log
  async buyLog(logId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Tìm và KHÓA vật phẩm để chống người khác mua cùng lúc
      const log = await manager.findOne(Log, {
        where: { id: logId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!log) {
        throw new NotFoundException('Log not found.');
      }
      if (!log.isAvailable) {
        throw new ConflictException('This log has already been sold.');
      }

      // 2. Tìm và KHÓA người dùng để đảm bảo số dư chính xác
      const user = await manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      console.log('User balance:', user);

      if (Number(user!.walletBalance) < Number(log.price)) {
        throw new ForbiddenException('Insufficient funds.');
      }

      // 3. Thực hiện các thay đổi
      // Trừ tiền user
      const newBalance = Number(user!.walletBalance) - Number(log.price);
      await manager.update(User, userId, { walletBalance: newBalance });

      // Cập nhật log thành đã bán
      await manager.update(Log, logId, { isAvailable: false });

      // Tạo bản ghi order
      const order = manager.create(LogOrder, {
        userId,
        logId,
        pricePaid: log.price,
      });
      await manager.save(order);

      this.logger.log(`User ${userId} successfully purchased log ${logId}`);

      return {
        message: 'Purchase successful!',
        newBalance,
      };
    });
  }

  async getDownloadPath(
    logId: number,
    userId: number,
  ): Promise<{
    filePath: string;
    fileName: string;
    fileSizeInBytes: number;
  }> {
    // 1. Kiểm tra quyền tải
    const order = await this.logOrdersRepository.findOne({
      where: { logId, userId },
      relations: ['log'],
    });

    if (!order) {
      throw new ForbiddenException('You have not purchased this log.');
    }

    // 2. File template gốc
    const templateFilePath = path.join(process.cwd(), 'uploads', 'seed.zip');

    if (!fs.existsSync(templateFilePath)) {
      throw new NotFoundException('Source template file not found on server.');
    }

    // 3. Tạo file tạm trong thư mục `tmp`
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }
    const tmpFilePath = path.join(tmpDir, `${order.log.id}-${Date.now()}.rar`);

    // Copy template sang file tạm
    await fs.promises.copyFile(templateFilePath, tmpFilePath);

    // 4. Padding cho đủ dung lượng yêu cầu
    const expectedSize = order.log.size * 1024; // bytes
    const stats = await fs.promises.stat(tmpFilePath);

    if (stats.size < expectedSize) {
      const paddingSize = expectedSize - stats.size;
      const buffer = Buffer.alloc(paddingSize, 0);
      await fs.promises.appendFile(tmpFilePath, buffer);
    } else if (stats.size > expectedSize) {
      // File lớn hơn → cắt bớt dung lượng
      const fd = fs.openSync(tmpFilePath, 'r+');
      fs.ftruncateSync(fd, expectedSize);
      fs.closeSync(fd);
    }

    return {
      filePath: tmpFilePath,
      fileName: order.log.struct,
      fileSizeInBytes: expectedSize,
    };
  }
}
