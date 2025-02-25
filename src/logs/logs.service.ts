import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { LogAction } from '../types/log-action.enum';
import { Logs } from './entities/logs.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class LogsService {
  /**Dodawanie logów Systemu*/

  async addLog(user: User, action: LogAction, book?: Book) {
    const log = Logs.create({
      action,
      user,
      book,
      cardNumber: user.cardNumber,
    });

    await log.save();
  }
}
