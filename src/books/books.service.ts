import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { User } from '../user/entities/user.entity';
import { ErrorInterface } from '../types/error.interface';
import { Rent } from '../rents/entities/rent.entity';
import { AddBookDto } from './dto/add-book.dto';
import { EditBookDto } from './dto/edit-book.dto';
import { IsNull, Not } from 'typeorm';
import { LogsService } from '../logs/logs.service';
import { LogAction } from '../types/log-action.enum';

@Injectable()
export class BooksService {
  @Inject(forwardRef(() => LogsService))
  private readonly logsService: LogsService;

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
      where: {
        removed: false,
      },
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
        removed: false,
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
      where: { slug: this.sanitizedSlug(slug), removed: false },
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
      cardNumber: user.cardNumber,
    });

    await rentedBook.save();

    book.count = availableBook - 1;

    book.rents = [];

    await this.logsService.addLog(user, LogAction.Rent, book);

    return book;
  }

  /**
   * Dodawanie książki
   * */
  async addBook(
    addBookDto: AddBookDto,
    user: User,
  ): Promise<Book | ErrorInterface> {
    // sprawdzanie, czy slug nie jest zajęty i ma minimum 1 znak

    const slug = this.sanitizedSlug(addBookDto.slug);

    if (slug.length < 1) {
      return {
        error: 'Slug musi posiadać minimum 1 znak',
      };
    }

    // sprawdzanie, czy w bazie nie ma książki, która posiada taki sam slug.

    const slugCount = await Book.countBy({ slug });

    if (slugCount > 0) {
      return {
        error: 'Książka z podanym slugiem już istnieje.',
      };
    }

    const newBook = Book.create({
      ...addBookDto,
      slug,
    });

    await newBook.save();

    await this.logsService.addLog(user, LogAction.Add);

    return newBook;
  }

  async editBook(
    editBookDto: EditBookDto,
    user: User,
  ): Promise<Book | ErrorInterface> {
    const slug = this.sanitizedSlug(editBookDto.slug);

    if (slug.length < 1) {
      return {
        error: 'Slug musi posiadać minimum 1 znak',
      };
    }

    // sprawdzanie, czy w bazie nie ma książki, która posiada taki sam slug.

    const slugCount = await Book.count({
      where: {
        slug,
        id: Not(editBookDto.id),
      },
    });

    if (slugCount > 0) {
      return {
        error: 'Książka z podanym slugiem już istnieje.',
      };
    }

    // pobieranie książki z bazy

    const book = await Book.findOne({
      where: {
        id: editBookDto.id,
        removed: false,
      },
    });

    if (!book) {
      return {
        error: 'Podana książka nie istnieje',
      };
    }

    // sprawdzanie, wiecej książek nie jest wypożyczonych niż wprowadzanych do stanu
    const rentsCount = await Rent.count({
      where: {
        book: {
          id: book.id,
        },
        returnDate: IsNull(),
      },
    });

    if (editBookDto.count < rentsCount) {
      return {
        error: `Aktualnie wypożyczonych jest ${rentsCount} sztuk. Nie można zmniejszyć ilości poniżej tej wartości`,
      };
    }

    book.title = editBookDto.title;
    book.author = editBookDto.author;
    book.count = editBookDto.count;
    book.description = editBookDto.description;
    book.slug = slug;

    await book.save();

    await this.logsService.addLog(user, LogAction.Edit, book);
    return book;
  }

  /**Usuwanie książki z systemu*/
  async deleteBook(
    editBookDto: EditBookDto,
    user: User,
  ): Promise<ErrorInterface | { success: true }> {
    const book = await Book.findOne({
      where: {
        id: editBookDto.id,
        removed: false,
      },
      relations: {
        rents: true,
      },
    });

    if (!book) {
      return {
        error: 'Podana książka nie istnieje w systemie',
      };
    }

    // sprawdzanie, czy książka nie jest wypożyczona

    const currentRent = book.rents.some((rent) => !rent.returnDate);

    if (currentRent) {
      return {
        error:
          'Książka jest akualtnie wypożyczona. Usunięcie jest niedozwolone',
      };
    }

    // oznaczanie książki jako usuniętej
    book.removed = true;
    await book.save();

    await this.logsService.addLog(user, LogAction.Delete, book);

    return {
      success: true,
    };
  }
}
