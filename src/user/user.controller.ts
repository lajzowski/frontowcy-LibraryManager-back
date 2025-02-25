import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @UseRule()
  @Get('auth-test')
  authTest() {
    return 'auth test';
  }

  /**Usuwanie konta użytkownika
   * @param _userId - id użytkownika (parametr niewykorzystywany)
   * @param user
   *
   */
  @UseRule()
  @Delete(':_userId')
  deleteUser(@Param('id') _userId: User['id'], @UserObj() user: User) {
    return this.userService.deleteUser(user);
  }
}
