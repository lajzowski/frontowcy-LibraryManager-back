import { Injectable } from '@nestjs/common';
import { Rent } from '../rents/entities/rent.entity';
import { User } from '../user/entities/user.entity';
import { ErrorInterface } from '../types/error.interface';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class AdminService {
  async getRents() {
    return Rent.find({
      relations: {
        book: true,
        user: true,
      },
    });
  }

  /**
   * Funkcja do zwracania książki na podstawie rent.id przez ADMINA
   * @param rentId
   * @return Rent
   * */
  async returnBook(rentId: string): Promise<Rent | ErrorInterface> {
    const rent = await Rent.findOne({
      where: {
        id: rentId,
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

    // ustawianie wynajmu na dzisiejszą datę
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
