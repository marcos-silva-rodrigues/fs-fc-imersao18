import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { EventsService } from '@app/core/events/events-core.service';
import { CriarEventoRequest } from './request/criar-evento.request';
import { AtualizarEventoRequest } from './request/atualizar-evento.request';
import { ReservarLugarRequest } from './request/reserva-lugar.request';
import { TicketKind } from '@prisma/client';
import { ReservarLugarResponse } from './response/reservar-lugar.response';
import { AuthGuard } from '@app/core/auth/auth.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  create(@Body() request: CriarEventoRequest) {
    return this.eventService.create({
      name: request.nome,
      description: request.descricao,
      price: request.preco,
      date: request.data
    });
  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() request: AtualizarEventoRequest) {
    return this.eventService.update(id, {
      name: request.nome,
      description: request.descricao,
      price: request.preco,
      date: request.data
    });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post(':id/reservar')
  async reserveSpots(
    @Body() reservarLugarRequest: ReservarLugarRequest,
    @Param('id') eventId: string,
  ) {
    console.log(reservarLugarRequest);
    const tickets = await this.eventService.reserveSpot({
      eventId,
      spots: reservarLugarRequest.lugares,
      ticket_kind:
        reservarLugarRequest.tipo_ingresso === 'inteira'
          ? TicketKind.full
          : TicketKind.half,
      email: reservarLugarRequest.email,
    });
    return new ReservarLugarResponse(tickets);
  }
}
