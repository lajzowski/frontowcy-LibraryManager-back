import { Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UseRule } from '../decorators/use-rule.decorator';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Pobieranie wszystkich wynajmów
   * */
  @UseRule(['a9'])
  @Get('rents')
  getRents() {
    return this.adminService.getRents();
  }

  /** Zwracanie książki
   * @param id rent id
   * @return Rent
   * */
  @UseRule(['a9'])
  @Patch('rents/return/:id')
  returnBook(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.returnBook(id);
  }
}
