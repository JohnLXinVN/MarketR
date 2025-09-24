// src/ticket/ticket.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketService.create(dto);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }
}
