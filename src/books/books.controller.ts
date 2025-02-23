import { Controller, Get, Param, Post } from '@nestjs/common';
import { BooksService } from './books.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

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

  @UseRule()
  @Post(':slug/rent')
  rentBook(@Param('slug') slug: string, @UserObj() user: User) {
    return this.booksService.rentBook(slug, user);
  }
}
