import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { UseRule } from '../decorators/use-rule.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Pobieranie ilości wypożyczonych książek w danym miesiącu
   * @param year
   * @param month
   * @param user
   * */
  @UseRule(['u0'])
  @Get('month/:year/:month')
  getMonthStats(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @UserObj() user: User,
  ) {
    return this.statsService.getMonthStats(year, month, user);
  }

  /**
   * Pobieranie ilości zwrotów w terminie i po terminie
   * */
  @UseRule(['u0'])
  @Get('return')
  getReturnStats(@UserObj() user: User) {
    return this.statsService.getReturnStats(user);
  }

  /**
   * Pobieranie liczbę aktualnie wypożyczonych książek
   * */
  @UseRule(['u0'])
  @Get('current')
  getCurrentStats(@UserObj() user: User) {
    return this.statsService.getCurrentStats(user);
  }
}
