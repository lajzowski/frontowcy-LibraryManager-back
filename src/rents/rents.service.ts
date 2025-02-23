import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Rent } from './entities/rent.entity';
import { ErrorInterface } from '../types/error.interface';
import { Book } from '../books/entities/book.entity';

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

  /**
   * Funkcja do zwracania książki na podstawie rent.id
   * @param rentId
   * @param user User
   * @return Rent
   * */
  async returnBook(rentId: string, user: User): Promise<Rent | ErrorInterface> {
    const rent = await Rent.findOne({
      where: {
        id: rentId,
        user: {
          id: user.id,
        },
      },
      relations: {
        book: true,
      },
    });

    if (!rent) {
      return {
        error: 'Nie znaleziono wynajmu',
      };
    }

    if (rent.returnDate) {
      return {
        error: 'Książka już została oddana!',
      };
    }

    // ustawianie wynajmu na dzisiejsza datę
    rent.returnDate = new Date();
    await rent.save();

    // pobieranie prawidłowej informacji o ilości książek

    const book = await Book.findOne({
      where: {
        id: rent.book.id,
      },
      relations: {
        rents: true,
      },
    });

    if (book?.rents) {
      const bookRents = book.rents.reduce(
        (prev, curr) => (!curr.returnDate ? prev + 1 : prev),
        0,
      );

      rent.book.count = book.count - bookRents;
    }

    return rent;
  }
}
