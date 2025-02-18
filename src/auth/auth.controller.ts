import {
  Body,
  Controller,
  Get,
  Head,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Response, Request } from 'express';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { User } from 'src/user/entities/user.entity';
import { UserObj } from 'src/decorators/user-obj.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<any> {
    return this.authService.login(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Head('/test')
  test(@Req() req: Request, @Res() res: Response) {
    res.status(204);
    return res.send();
  }
}
