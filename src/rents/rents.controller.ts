import { Controller, Get } from '@nestjs/common';
import { RentsService } from './rents.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('rents')
export class RentsController {
  constructor(private readonly rentsService: RentsService) {}

  /**
   * Funkcja zwraca wszystkie wynajmowane książki wraz ze zwróconymi
   * dla zalogowanego użytkownika.
   * */
  @UseRule()
  @Get('')
  getAllRents(@UserObj() user: User) {
    return this.rentsService.getAllRents(user);
  }
}
