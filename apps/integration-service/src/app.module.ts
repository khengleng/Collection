import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { FineractModule } from './fineract/fineract.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FineractModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
