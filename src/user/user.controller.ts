import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from './entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  @UseRule()
  findCurrent(@UserObj() user: User) {
    return user;
  }

  @Post('register')
  register(@Body() obj: UserRegisterDto) {
    return this.userService.register(obj);
  }
}
