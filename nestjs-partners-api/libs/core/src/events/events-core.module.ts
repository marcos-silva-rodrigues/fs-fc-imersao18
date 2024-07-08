import { Module } from '@nestjs/common';
import { EventService } from './events-core.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [EventService],
})
export class EventCoreModule {}
