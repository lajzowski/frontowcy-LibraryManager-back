import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { LogsService } from '../logs/logs.service';

@Module({
  providers: [AdminService, LogsService],
  controllers: [AdminController],
  imports: [],
})
export class AdminModule {}
