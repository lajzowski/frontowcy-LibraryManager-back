import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentsService {
  /**
   * Funkcja zwraca wszystkie wynajmowane książki wraz ze zwróconymi
   * dla zalogowanego użytkownika.
   * */
  async getAllRents(user: User) {
    return Rent.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        book: true,
      },
    });
  }
}
