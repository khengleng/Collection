import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@collection/database';
import { AppController } from './app.controller';
import { DebtorsModule } from './debtors/debtors.module';
import { AccountsModule } from './accounts/accounts.module';
import { CasesModule } from './cases/cases.module';
import { EventsModule } from './events/events.module';
import { TemporalService } from './temporal.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    DebtorsModule,
    AccountsModule,
    CasesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [TemporalService],
  exports: [TemporalService],
})
export class AppModule {}
