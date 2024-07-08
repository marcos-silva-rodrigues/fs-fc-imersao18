import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpotsModule } from './spots/spots.module';

@Module({
  imports: [EventModule, PrismaModule, SpotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
