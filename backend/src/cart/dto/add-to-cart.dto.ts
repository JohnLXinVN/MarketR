import { IsNotEmpty, IsNumber, IsArray } from 'class-validator';

// DTO cho việc thêm 1 sản phẩm
export class CreateCartItemDto {
  @IsNotEmpty()
  @IsNumber()
  cvvId: string;
}

// DTO cho việc thêm nhiều sản phẩm
export class CreateBulkCartItemsDto {
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  cvvIds: string[];
}
