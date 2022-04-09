import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

@Module({
  imports: [HttpModule],
  providers: [TodoService],
  controllers: [TodoController],
})
export class TodoModule {}
