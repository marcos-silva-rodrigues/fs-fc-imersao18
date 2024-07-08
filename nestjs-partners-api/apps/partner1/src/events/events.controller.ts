import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { EventsService } from '@app/core/events/events-core.service';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';
import { ReserveSpotRequest } from './request/reserve-spot.request';

@Controller('event')
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  create(@Body() request: CreateEventRequest) {
    return this.eventService.create(request);
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
  update(@Param('id') id: string, @Body() request: UpdateEventRequest) {
    return this.eventService.update(id, request);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Post(':id/reverse')
  reserveSpot(@Param('id') eventId: string, @Body() request: ReserveSpotRequest) {
    return this.eventService.reserveSpot(eventId, request)
  }
}