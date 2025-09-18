import { Transform, Type } from 'class-transformer';

import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
} from 'class-validator';

export class FindCvvDto {
  @IsOptional()
  @IsString()
  bin?: string;

  @IsOptional()
  @IsString()
  bank?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  // Dùng 'true'/'false' trong query string (?ssn=true)
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  ssn?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  dob?: boolean;

  @IsOptional()
  @IsString()
  type?: string; // cardType

  @IsOptional()
  @IsString()
  level?: string; // cardLevel

  @IsOptional()
  @IsString()
  cardClass?: string; // cardClass

  @IsOptional()
  @IsString()
  vendor?: string; // sellerName

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Tự động chuyển string từ query sang number
  priceMin?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  priceMax?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 10; // Giống 'Per Page' trong UI
}
