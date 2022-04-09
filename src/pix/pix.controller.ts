import { Controller, Post } from '@nestjs/common';
import { PixService } from './pix.service';

@Controller('pix')
export class PixController {
  constructor(private readonly pixService: PixService) {}

  @Post()
  async resendContingencyList() {
    return this.pixService.resendContingencyList();
  }
}
