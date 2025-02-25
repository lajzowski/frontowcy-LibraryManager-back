import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthController } from './auth.controller';
import { LogsService } from '../logs/logs.service';

@Module({
  imports: [],
  providers: [AuthService, JwtStrategy, LogsService],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
