import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FineractController } from './fineract.controller';
import { FineractService } from './fineract.service';
import { SyncService } from './sync.service';

@Module({
  imports: [HttpModule],
  controllers: [FineractController],
  providers: [FineractService, SyncService],
  exports: [FineractService, SyncService],
})
export class FineractModule {}
