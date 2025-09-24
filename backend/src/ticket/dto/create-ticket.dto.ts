// src/ticket/dto/create-ticket.dto.ts
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  subject: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  paymentAddress: string;
}
