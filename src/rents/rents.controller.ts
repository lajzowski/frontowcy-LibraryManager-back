import { Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { RentsService } from './rents.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { ReturnBookDto } from './dto/return-book.dto';

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

  /** Zwracanie książki
   * @param id rent id
   * @param user
   * @return Rent
   * */
  @UseRule()
  @Patch('return/:id')
  returnBook(@Param('id', ParseUUIDPipe) id: string, @UserObj() user: User) {
    return this.rentsService.returnBook(id, user);
  }
}
