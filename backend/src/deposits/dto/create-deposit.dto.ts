import { IsNotEmpty, IsIn } from 'class-validator';

export class CreateDepositDto {
  @IsNotEmpty()
  @IsIn(['btc', 'ltc', 'usdt'])
  currency: string;
}
