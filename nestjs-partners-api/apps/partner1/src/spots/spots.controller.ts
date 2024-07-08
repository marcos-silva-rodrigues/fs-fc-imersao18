import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots-core.service';
import { CreateSpotRequest } from './request/create-spot.request';
import { UpdateSpotRequest } from './request/update-spot.request';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(@Param('eventId') eventId: string, @Body() request: CreateSpotRequest) {
    return this.spotsService.create(eventId, request);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(@Param('eventId') eventId: string, @Param('spotId') spotId: string, @Body() request: UpdateSpotRequest) {
    return this.spotsService.update(eventId, spotId, request);
  }

  @Delete(':spotId')
  remove(@Param('eventId') eventId: string, @Param('spotId') spotId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
