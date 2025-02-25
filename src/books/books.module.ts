import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { LogsService } from '../logs/logs.service';

@Module({
  controllers: [BooksController],
  providers: [BooksService, LogsService],
})
export class BooksModule {}
