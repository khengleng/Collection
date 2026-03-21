import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DomainEvent } from '@collection/event-contracts';
import { EventsService } from './events.service';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('ingest')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Ingest a domain event' })
  @ApiResponse({ status: 202, description: 'The event has been accepted and is being processed.' })
  async ingest(@Body() event: DomainEvent) {
    return this.eventsService.ingest(event);
  }
}
