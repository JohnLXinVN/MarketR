import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryLogsDto } from './dto/query-logs.dto';
import { Log } from './log.entity';
import { async } from './../../../frontend/src/app/api/countries/route';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logsRepository: Repository<Log>,
  ) {}

  async search(queryDto: QueryLogsDto) {
    const { page = 1, limit = 10, ...filters } = queryDto;
    const queryBuilder = this.logsRepository.createQueryBuilder('log');

    // Áp dụng các bộ lọc động

    queryBuilder.where('log.isAvailable = :isAvailable', {
      isAvailable: true,
    });

    if (filters.stealer) {
      queryBuilder.andWhere('log.stealer LIKE :stealer', {
        stealer: `%${filters.stealer}%`,
      });
    }
    if (filters.system) {
      queryBuilder.andWhere('log.system_name LIKE :system', {
        system: `%${filters.system}%`,
      });
    }
    if (filters.country) {
      queryBuilder.andWhere('log.country = :country', {
        country: filters.country,
      });
    }
    if (filters.outlook) {
      queryBuilder.andWhere('log.hasOutlook = :hasOutlook', {
        hasOutlook: filters.outlook == 'yes',
      });
    }
    if (filters.state) {
      queryBuilder.andWhere('log.state LIKE :state', {
        state: `%${filters.state}%`,
      });
    }
    if (filters.city) {
      queryBuilder.andWhere('log.city LIKE :city', {
        city: `%${filters.city}%`,
      });
    }
    if (filters.zip) {
      queryBuilder.andWhere('log.zip LIKE :zip', { zip: `%${filters.zip}` });
    }
    if (filters.isp) {
      queryBuilder.andWhere('log.isp LIKE :isp', { isp: `%${filters.isp}%` });
    }
    if (filters.vendor) {
      queryBuilder.andWhere('log.vendor = :vendor', { vendor: filters.vendor });
    }
    // Lọc cho các trường array
    if (filters.links_contains) {
      const links = filters.links_contains
        .split(',')
        .map((link) => link.trim())
        .filter(Boolean);

      if (links.length > 0) {
        const conditions = links.map((_, i) => `log.links LIKE :link${i}`);
        queryBuilder.andWhere(conditions.join(' OR '));
        links.forEach((link, i) =>
          queryBuilder.setParameter(`link${i}`, `%${link}%`),
        );
      }
    }

    // Lọc theo emails (simple-array -> TEXT)
    if (filters.email_contains) {
      const emails = filters.email_contains
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

      if (emails.length > 0) {
        const conditions = emails.map((_, i) => `log.emails LIKE :email${i}`);
        queryBuilder.andWhere(conditions.join(' OR '));
        emails.forEach((email, i) =>
          queryBuilder.setParameter(`email${i}`, `%${email}%`),
        );
      }
    }

    // Phân trang
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Sắp xếp
    queryBuilder.orderBy('log.createdAt', 'DESC');

    const [results, total] = await queryBuilder.getManyAndCount();

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getFilterOptions() {
    // Lấy giá min và max

    // Lấy danh sách các giá trị duy nhất cho các trường khác
    const getDistinctValues = async (field) => {
      const result = await this.logsRepository
        .createQueryBuilder('logs')
        .select(`DISTINCT ${String(field)}`)
        .where(`${String(field)} IS NOT NULL`)
        .andWhere('logs.isAvailable = :isAvailable', { isAvailable: true })
        .orderBy(String(field), 'ASC')
        .getRawMany();
      return result.map((item) => item[field]);
    };

    const [stealers, systems, vendors] = await Promise.all([
      getDistinctValues('stealer'),
      getDistinctValues('system_name'),
      getDistinctValues('vendor'),
    ]);

    return {
      stealers,
      systems,
      vendors,
    };
  }
}
