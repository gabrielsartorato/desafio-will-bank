import { Module } from '@nestjs/common';
import { TodoModule } from './todo/todo.module';
import { PixModule } from './pix/pix.module';

@Module({
  imports: [TodoModule, PixModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
