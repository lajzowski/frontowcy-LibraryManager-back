import { Module } from '@nestjs/common';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [],
  controllers: [RentsController],
  providers: [RentsService, LogsService],
})
export class RentsModule {}
