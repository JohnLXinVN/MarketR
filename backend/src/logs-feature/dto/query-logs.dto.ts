import { IsOptional, IsString, IsIn, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLogsDto {
  @IsOptional()
  @IsString()
  stealer?: string;

  @IsOptional()
  @IsString()
  system?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  links_contains?: string; // vd: "amazon.com,ebay.com"

  @IsOptional()
  @IsIn(['yes', 'no'])
  outlook?: 'yes' | 'no';

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  zip?: string;

  @IsOptional()
  @IsString()
  isp?: string;

  @IsOptional()
  @IsString()
  email_contains?: string;

  @IsOptional()
  @IsString()
  vendor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
