import { Module } from '@nestjs/common';
import { PixService } from './pix.service';
import { HttpModule } from '@nestjs/axios';
import { PixController } from './pix.controller';

@Module({
  imports: [HttpModule],
  providers: [PixService],
  controllers: [PixController],
})
export class PixModule {}
