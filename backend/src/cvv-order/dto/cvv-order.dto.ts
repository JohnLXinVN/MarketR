import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class FindOrdersDto {
  @IsOptional()
  @Type(() => Number) // Tự động chuyển đổi string từ query param sang number
  @IsNumber()
  @Min(1, { message: 'Page must be greater than 0' })
  page?: number;

  @IsOptional()
  @Type(() => Number) // Tự động chuyển đổi string từ query param sang number
  @IsNumber()
  @Min(1, { message: 'Limit must be greater than 0' })
  limit?: number;
}
