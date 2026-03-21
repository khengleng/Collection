import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { WorkerService } from './worker.service';
import { CollectionActivities } from './activities/collection.activities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [WorkerService, CollectionActivities],
})
export class AppModule {}
