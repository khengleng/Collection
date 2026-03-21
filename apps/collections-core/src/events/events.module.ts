import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TemporalService } from '../temporal.service';

@Module({
  controllers: [EventsController],
  providers: [EventsService, TemporalService],
  exports: [EventsService],
})
export class EventsModule {}
