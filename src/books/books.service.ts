import { Injectable } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { ErrorInterface } from '../types/error.interface';
import { Rent } from '../rents/entities/rent.entity';

@Injectable()
export class BooksService {
  /** Usuwanie polskich znaków i zabezpieczenie slug-a */
  private sanitizedSlug(slug: string) {
    return slug
      .normalize('NFD')
      .replace(
        /[ąćęłńóśźż]/g,
        (char) =>
          ({
            ą: 'a',
            ć: 'c',
            ę: 'e',
            ł: 'l',
            ń: 'n',
            ó: 'o',
            ś: 's',
            ź: 'z',
            ż: 'z',
          })[char] || '',
      )
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
  }

  /**
   * Pobieranie wszystkich książek */
  async getAllBooks() {
    const books = await Book.find({
      relations: {
        rents: true,
      },
    });

    return books.map((book) => {
      const bookRents = book.rents.reduce(
        (prev, curr) => (!curr.returnDate ? prev + 1 : prev),
        0,
      );

      book.count = book.count - bookRents;
      book.rents = [];
      return book;
    });
  }

  /** Pobieranie jednej książki na podstawie slug-a
   * @param slug
   * */
  async getBookBySlug(slug: string): Promise<Book | ErrorInterface> {
    const book = await Book.findOne({
      where: {
        slug: this.sanitizedSlug(slug),
      },
      relations: {
        rents: true,
      },
    });

    if (!book) {
      return {
        error: 'Podana książka nie istnieje',
      };
    }

    const bookRents = book.rents.reduce(
      (prev, curr) => (!curr.returnDate ? prev + 1 : prev),
      0,
    );

    book.count = book.count - bookRents;
    book.rents = [];
    return book;
  }

  async rentBook(slug: string, user: User): Promise<Book | ErrorInterface> {
    // pobieranie książki wraz z relacją
    const book = await Book.findOne({
      where: { slug: this.sanitizedSlug(slug) },
      relations: {
        rents: true,
      },
    });

    if (!book) {
      return {
        error: 'Podana książka nie istnieje',
      };
    }

    const bookRents = book.rents.reduce(
      (prev, curr) => (!curr.returnDate ? prev + 1 : prev),
      0,
    );

    const availableBook = book.count - bookRents;

    if (availableBook === 0) {
      return {
        error: 'brak dostępnych książek',
      };
    }

    const rentedBook = Rent.create({
      book,
      user,
    });

    await rentedBook.save();

    book.count = availableBook - 1;

    book.rents = [];

    return book;
  }
}
