import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { EventsService } from '@app/core/events/events-core.service';
import { CriarEventoRequest } from './request/criar-evento.request';
import { AtualizarEventoRequest } from './request/atualizar-evento.request';
import { ReservarLugarRequest } from './request/reserva-lugar.request';

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

  @Post(':id/reservar')
  reserveSpot(@Param('id') id: string, @Body() request: ReservarLugarRequest) {
    return this.eventService.reserveSpot(id, {
      email: request.email,
      spots: request.lugares,
      ticket_kind: request.tipo_ingresso
    })
  }
}
