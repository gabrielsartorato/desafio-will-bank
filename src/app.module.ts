import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PixModule } from './pix/pix.module';

@Module({
  imports: [PixModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
