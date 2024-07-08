import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots-core.service';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualizar-lugar.request';

@Controller('eventos/:eventoId/lugares')
export class LugaresController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Param('eventoId') eventoId: string, @Body() request: CriarLugarRequest) {
    return this.spotsService.create(eventoId, {
      name: request.nome
    });
  }

  @Get()
  findAll(@Param('eventoId') eventoId: string) {
    return this.spotsService.findAll(eventoId);
  }

  @Get(':lugarId')
  findOne(@Param('eventoId') eventoId: string, @Param('lugarId') spotId: string) {
    return this.spotsService.findOne(eventoId, spotId);
  }

  @Patch(':lugarId')
  update(@Param('eventoId') eventoId: string, @Param('lugarId') spotId: string, @Body() request: AtualizarLugarRequest) {
    return this.spotsService.update(eventoId, spotId, {
      name: request.nome
    });
  }

  @Delete(':lugarId')
  remove(@Param('eventoId') eventoId: string, @Param('lugarId') spotId: string) {
    return this.spotsService.remove(eventoId, spotId);
  }
}
