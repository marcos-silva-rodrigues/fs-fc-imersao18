import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { EventsService } from '@app/core/events/events-core.service';
import { CreateEventRequest } from './request/create-event.request';
import { UpdateEventRequest } from './request/update-event.request';
import { ReserveSpotRequest } from './request/reserve-spot.request';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { ReserveSpotResponse } from './response/reserve-spot.response';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

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

  @UseGuards(AuthGuard)
  @Post(':id/reserve')
  async reserveSpots(
    @Body() reserveRequest: ReserveSpotRequest,
    @Param('id') eventId: string,
  ) {
    const tickets = await this.eventService.reserveSpot({
      ...reserveRequest,
      eventId
    });
    return new ReserveSpotResponse(tickets);
  }
}
