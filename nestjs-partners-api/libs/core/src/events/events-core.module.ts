import { Module } from '@nestjs/common';
import { EventService } from './events-core.service';

@Module({
  providers: [EventService],
  exports: [EventService]
})
export class EventCoreModule {}
