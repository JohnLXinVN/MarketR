import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { FindCvvDto } from './dto/find-cvv.dto';
import { CVV } from './cvv.entity';
import { async } from './../../../frontend/src/app/api/countries/route';

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
      .select('DISTINCT cvvs.cardType', 'cardType')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: 1 })
      .orderBy('cvvs.cardType', 'ASC')
      .getRawMany();

    return types.map((t) => t.cardType);
  }

  async getCardClass() {
    const classes = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('DISTINCT cvvs.cardClass', 'cardClass')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: 1 })
      .orderBy('cvvs.cardClass', 'ASC')
      .getRawMany();

    return classes.map((t) => t.cardClass);
  }

  async getCardLevel() {
    const levels = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('DISTINCT cvvs.cardLevel', 'cardLevel')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: 1 })
      .orderBy('cvvs.cardLevel', 'ASC')
      .getRawMany();

    return levels.map((t) => t.cardLevel);
  }

  async getMinMaxPrice() {
    const result = await this.cvvRepository
      .createQueryBuilder('cvvs')
      .select('MIN(cvvs.price)', 'minPrice')
      .addSelect('MAX(cvvs.price)', 'maxPrice')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: true })
      .getRawOne();

    return {
      min: parseFloat(result.minPrice),
      max: parseFloat(result.maxPrice),
    };
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
      cardClass, // 'class' là từ khóa nên đổi tên
      vendor,
      priceMin,
      priceMax,
    } = queryDto;

    const queryBuilder = this.cvvRepository.createQueryBuilder('cvvs');

    // Chỉ lấy các item đang có sẵn để bán
    queryBuilder.where('cvvs.isAvailable = :isAvailable', {
      isAvailable: true,
    });

    // Áp dụng các bộ lọc
    if (bin) {
      // Tìm kiếm theo bin, có thể tìm kiếm một phần
      queryBuilder.andWhere('cvvs.binNumber LIKE :bin', { bin: `${bin}%` });
    }
    if (bank) {
      queryBuilder.andWhere('cvvs.issuingBank LIKE :bank', {
        bank: `%${bank}%`,
      });
    }
    if (country) {
      queryBuilder.andWhere('cvvs.country = :country', {
        country: `${country}`,
      });
    }
    if (state) {
      queryBuilder.andWhere('cvvs.state LIKE :state', { state: `%${state}%` });
    }
    if (city) {
      queryBuilder.andWhere('cvvs.city LIKE :city', { city: `%${city}%` });
    }
    if (zip) {
      queryBuilder.andWhere('cvvs.zip LIKE :zip', { zip: `%${zip}%` });
    }
    if (type) {
      queryBuilder.andWhere('LOWER(cvvs.cardType) = LOWER(:type)', {
        type: `${type}`,
      });
    }
    if (level) {
      queryBuilder.andWhere('LOWER(cvvs.cardLevel) = LOWER(:level)', {
        level: `${level}`,
      });
    }
    if (cardClass) {
      queryBuilder.andWhere('LOWER(cvvs.cardClass) = LOWER(:cardClass)', {
        cardClass: `${cardClass}`,
      });
    }
    if (vendor) {
      queryBuilder.andWhere('cvvs.sellerName LIKE :vendor', {
        vendor: `%${vendor}%`,
      });
    }

    // Lọc theo SSN và DOB
    if (ssn) {
      queryBuilder.andWhere('cvvs.hasSsn = :ssn', { ssn });
    }
    if (dob) {
      queryBuilder.andWhere('cvvs.hasDob = :dob', { dob });
    }

    // Lọc theo khoảng giá
    if (priceMin) {
      queryBuilder.andWhere('cvvs.price >= :priceMin', { priceMin });
    }
    if (priceMax) {
      queryBuilder.andWhere('cvvs.price <= :priceMax', { priceMax });
    }

    // Phân trang
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Sắp xếp (ví dụ: mới nhất lên trước)
    queryBuilder.orderBy('cvvs.createdAt', 'DESC');

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
      .select('MIN(cvvs.price)', 'min')
      .addSelect('MAX(cvvs.price)', 'max')
      .where('cvvs.isAvailable = :isAvailable', { isAvailable: true });

    const priceResult = await priceRangeQuery.getRawOne();

    // Lấy danh sách các giá trị duy nhất cho các trường khác
    const getDistinctValues = async (field: keyof CVV) => {
      const result = await this.cvvRepository
        .createQueryBuilder('cvv')
        .select(`DISTINCT ${String(field)}`)
        .where(`${String(field)} IS NOT NULL`)
        .andWhere('cvvs.isAvailable = :isAvailable', { isAvailable: true })
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
