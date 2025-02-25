import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { LogsService } from '../logs/logs.service';

@Module({
  controllers: [UserController],
  providers: [UserService, LogsService],
})
export class UserModule {}
