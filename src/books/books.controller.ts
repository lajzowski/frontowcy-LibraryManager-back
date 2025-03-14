import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { AddBookDto } from './dto/add-book.dto';
import { EditBookDto } from './dto/edit-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  /** Pobieranie wszystkich książek jednocześnie
   * */
  @Get()
  getAllBooks() {
    return this.booksService.getAllBooks();
  }

  /** Pobieranie jednej książki na podstawie slug-a
   * @param slug
   * */
  @Get(':slug')
  getBookBySlug(@Param('slug') slug: string) {
    return this.booksService.getBookBySlug(slug);
  }

  /**Wypożyczania pojedynczej książki przez zalogowanego użytkownika
   *
   * @param slug - unikalny slug książki
   * @param user - zwraca obiekt zalogowanego użytkownika
   * */

  @UseRule(['u0'])
  @Post(':slug/rent')
  rentBook(@Param('slug') slug: string, @UserObj() user: User) {
    return this.booksService.rentBook(slug, user);
  }

  /**
   * Dodawanie książki przez Admina
   * */
  @UseRule(['a9'])
  @Post()
  async addBook(@Body() addBookDto: AddBookDto, @UserObj() user: User) {
    const result = await this.booksService.addBook(addBookDto, user);
    if ('error' in result) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST, {
        cause: new Error(result.error),
      });
    }
    return result;
  }

  /** Edycja książki przez Admina- UWAGA! wykorzystano ID książki, nie slug jak przy pobieraniu
   * @param bookId id książki
   * */
  @UseRule(['a9'])
  @Patch(':bookId')
  async editBook(
    @Param('bookId') bookId: number,
    @Body() editBookDto: EditBookDto,
    @UserObj() user: User,
  ) {
    const result = await this.booksService.editBook(editBookDto, user);
    if ('error' in result) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST, {
        cause: new Error(result.error),
      });
    }
    return result;
  }

  /** Usuwanie książki przez Admina- UWAGA! wykorzystano ID książki, nie slug jak przy pobieraniu
   * @param bookId id książki
   * */
  @UseRule(['a9'])
  @Delete(':bookId')
  async deleteBook(
    @Param('bookId') bookId: number,
    @Body() editBookDto: EditBookDto,
    @UserObj() user: User,
  ) {
    const result = await this.booksService.deleteBook(editBookDto, user);
    if ('error' in result) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST, {
        cause: new Error(result.error),
      });
    }
    return result;
  }
}
