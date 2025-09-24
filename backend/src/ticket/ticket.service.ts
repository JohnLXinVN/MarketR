import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepo: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    const ticket = this.ticketRepo.create(createTicketDto);
    return this.ticketRepo.save(ticket);
  }

  async findAll() {
    return this.ticketRepo.find({ order: { createdAt: 'DESC' } });
  }
}
