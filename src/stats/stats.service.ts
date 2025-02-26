import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ErrorInterface } from '../types/error.interface';
import { Rent } from '../rents/entities/rent.entity';
import { Between, IsNull, Raw } from 'typeorm';
import { RentsCountResponse } from '../types/rents-count-response.interface';
import { ReturnCountResponse } from '../types/return-count-response.interface';
import { CurrentCountResponse } from '../types/current-count-response.interface';

@Injectable()
export class StatsService {
  async getMonthStats(
    year: number,
    month: number,
    user: User,
  ): Promise<ErrorInterface | RentsCountResponse> {
    // walidacja year i month
    if (!/^\d{4}$/.test(year.toString())) {
      return {
        error: 'Year must be a 4-digit number.',
      };
    }

    if (month < 1 || month > 12 || !Number.isInteger(month)) {
      return {
        error: 'Month must be an integer between 1 and 12.',
      };
    }

    const rentsCount = await Rent.count({
      where: {
        rentDate: Between(
          new Date(year, month - 1, 1), // Pierwszy dzień miesiąca
          new Date(year, month, 0, 23, 59, 59, 999), // Ostatni dzień miesiąca
        ),
        user: {
          id: user.id,
        },
      },
    });

    return {
      rentsCount,
    };
  }

  async getReturnStats(user: User): Promise<ReturnCountResponse> {
    const returnCount = await Rent.count({
      where: {
        user: {
          id: user.id,
        },
        rentDate: Raw((alias) => `${alias} IS NOT NULL`), // rentDate musi istnieć
        returnDate: Raw(
          (alias) =>
            `${alias} IS NOT NULL AND DATEDIFF(${alias}, rentDate) <= 14`,
        ),
      },
    });

    const returnDelayedCount = await Rent.count({
      where: {
        user: {
          id: user.id,
        },
        rentDate: Raw((alias) => `${alias} IS NOT NULL`), // rentDate musi istnieć
        returnDate: Raw(
          (alias) =>
            `${alias} IS NOT NULL AND DATEDIFF(${alias}, rentDate) > 14`,
        ),
      },
    });

    return {
      returnCount,
      returnDelayedCount,
    };
  }

  async getCurrentStats(user: User): Promise<CurrentCountResponse> {
    const currentCount = await Rent.count({
      where: {
        user: {
          id: user.id,
        },
        returnDate: IsNull(),
      },
    });

    return {
      currentCount,
    };
  }
}
