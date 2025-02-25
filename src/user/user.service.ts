import { Injectable } from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './entities/user.entity';
import { ErrorInterface } from '../types/error.interface';
import { hashPassword } from '../utils/hash-password';
import { Rent } from '../rents/entities/rent.entity';
import { IsNull } from 'typeorm';

@Injectable()
export class UserService {
  /**
   * Generowanie prostego numeru karty*/
  private generateCardNumber = (): number => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };

  /**
   * Rejestracja użytkownika
   * */
  async register({
    email,
    firstname,
    lastname,
    password,
  }: UserRegisterDto): Promise<ErrorInterface | Omit<User, 'password'>> {
    //sprawdzanie, czy użytkownik z taki adresem email już nie istnieje

    const user = await User.findOneBy({ email });

    if (user) {
      return {
        error: 'Do podanego adresu e-mail jest już przypisany użytkownik',
      };
    }

    // generowanie prostego numeru karty
    const cardNumber = this.generateCardNumber();

    // tworzenie użytkownika

    const newUser = User.create({
      cardNumber,
      firstname,
      lastname,
      email,
      password: hashPassword(password),
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword as Omit<User, 'password'>;
  }

  async deleteUser(
    userData: User,
  ): Promise<ErrorInterface | { removed: true }> {
    const user = await User.findOne({
      where: {
        id: userData.id,
      },
    });

    // sprawdzanie, czy user istnieje.
    if (!user) {
      return {
        error: 'Użytkownik nie istnieje',
      };
    }

    // sprawdzanie, czy zwrócił wszystkie książki

    const rents = await Rent.findOne({
      where: {
        user: {
          id: user.id,
        },
        returnDate: IsNull(),
      },
    });

    if (rents) {
      return {
        error: 'Użytkownik nie zwrócił wszystkich książek',
      };
    }

    // usuwanie użytkownika

    await user.remove();

    return {
      removed: true,
    };
  }
}
