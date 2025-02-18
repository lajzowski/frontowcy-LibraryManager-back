import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
