import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { FindCvvDto } from './dto/find-cvv.dto';
import { CVV } from './cvv.entity';

@Injectable()
export class CvvService {
  constructor(
    @InjectRepository(CVV)
    private readonly cvvRepository: Repository<CVV>,
  ) {}

  /**
   * Lấy danh sách CVV với các bộ lọc, phân trang và sắp xếp
   */

  async getCardTypes() {
    const types = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('DISTINCT cvv.cardType', 'cardType')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy('cvvs.cardType', 'ASC')
      .getRawMany();

    return types.map((t) => t.cardType);
  }

  async getCardClass() {
    const classes = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('DISTINCT cvv.cardClass', 'cardClass')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy('cvvs.cardClass', 'ASC')
      .getRawMany();

    return classes.map((t) => t.cardClass);
  }

  async getCardLevel() {
    const levels = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('DISTINCT cvv.cardLevel', 'cardLevel')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: true })
      .orderBy('cvvs.cardLevel', 'ASC')
      .getRawMany();

    return levels.map((t) => t.cardLevel);
  }

  async findAll(queryDto: FindCvvDto) {
    const {
      page = 1,
      limit = 10,
      bin,
      bank,
      country,
      state,
      city,
      zip,
      ssn,
      dob,
      type,
      level,
      class: cardClass, // 'class' là từ khóa nên đổi tên
      vendor,
      priceMin,
      priceMax,
    } = queryDto;

    const queryBuilder = this.cvvRepository.createQueryBuilder('cvvs');

    // Chỉ lấy các item đang có sẵn để bán
    queryBuilder.where('cvv.isAvailable = :isAvailable', { isAvailable: true });

    // Áp dụng các bộ lọc
    if (bin) {
      // Tìm kiếm theo bin, có thể tìm kiếm một phần
      queryBuilder.andWhere('cvv.binNumber LIKE :bin', { bin: `${bin}%` });
    }
    if (bank) {
      queryBuilder.andWhere('cvv.issuingBank = :bank', { bank });
    }
    if (country && country.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.country = :country', { country });
    }
    if (state && state.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.state = :state', { state });
    }
    if (city && city.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.city = :city', { city });
    }
    if (zip && zip.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.zip = :zip', { zip });
    }
    if (type && type.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.cardType = :type', { type });
    }
    if (level && level.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.cardLevel = :level', { level });
    }
    if (cardClass && cardClass.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.cardClass = :cardClass', { cardClass });
    }
    if (vendor && vendor.toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.sellerName = :vendor', { vendor });
    }

    // Lọc theo SSN và DOB
    if (ssn !== undefined && String(ssn).toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.hasSsn = :ssn', { ssn });
    }
    if (dob !== undefined && String(dob).toLowerCase() !== 'all') {
      queryBuilder.andWhere('cvv.hasDob = :dob', { dob });
    }

    // Lọc theo khoảng giá
    if (priceMin) {
      queryBuilder.andWhere('cvv.price >= :priceMin', { priceMin });
    }
    if (priceMax) {
      queryBuilder.andWhere('cvv.price <= :priceMax', { priceMax });
    }

    // Phân trang
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Sắp xếp (ví dụ: mới nhất lên trước)
    queryBuilder.orderBy('cvv.createdAt', 'DESC');

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Lấy các tùy chọn cho bộ lọc, bao gồm giá min/max
   */
  async getFilterOptions() {
    // Lấy giá min và max
    const priceRangeQuery = this.cvvRepository
      .createQueryBuilder('cvv')
      .select('MIN(cvv.price)', 'min')
      .addSelect('MAX(cvv.price)', 'max')
      .where('cvv.isAvailable = :isAvailable', { isAvailable: true });

    const priceResult = await priceRangeQuery.getRawOne();

    // Lấy danh sách các giá trị duy nhất cho các trường khác
    const getDistinctValues = async (field: keyof CVV) => {
      const result = await this.cvvRepository
        .createQueryBuilder('cvv')
        .select(`DISTINCT ${String(field)}`)
        .where(`${String(field)} IS NOT NULL`)
        .andWhere('cvv.isAvailable = :isAvailable', { isAvailable: true })
        .orderBy(String(field), 'ASC')
        .getRawMany();
      return result.map((item) => item[field]);
    };

    const [countries, banks, types, levels, classes, vendors] =
      await Promise.all([
        getDistinctValues('country'),
        getDistinctValues('issuingBank'),
        getDistinctValues('cardType'),
        getDistinctValues('cardLevel'),
        getDistinctValues('cardClass'),
        getDistinctValues('sellerName'),
      ]);

    return {
      price: {
        min: parseFloat(priceResult.min) || 0,
        max: parseFloat(priceResult.max) || 100,
      },
      countries,
      banks,
      types,
      levels,
      classes,
      vendors,
      // Bạn có thể thêm các trường khác như state, city nếu cần
    };
  }
}
