import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { AuthLoginDto } from 'src/auth/dto/auth-login.dto';
import { User } from 'src/user/entities/user.entity';
import { hashPassword } from 'src/utils/hash-password';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from 'src/auth/jwt.strategy';

@Injectable()
export class AuthService {
  constructor() {}

  private async createToken(
    currentTokenId: string,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(payload, process.env.JWT_KEY, {
      expiresIn,
    });

    return {
      accessToken,
      expiresIn,
    };
  }

  private async generateToken(user: User): Promise<string> {
    let token;
    let userWithThisToken: User | null = null;
    do {
      token = uuid();
      userWithThisToken = await User.findOneBy({ token });
    } while (!!userWithThisToken);
    user.token = token;
    await user.save();

    return token;
  }

  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOneBy({
        cardNumber: req.cardNumber,
        password: hashPassword(req.password),
      });

      if (!user) {
        return res.status(403).json({ error: 'Błędne dane logowania!' });
      }

      const token = await this.createToken(await this.generateToken(user));

      const { password: _, token: _1, ...userWithoutPassword } = user;

      return (
        res
          .status(200)
          //.cookie(this.cookieName, token.accessToken, this.cookieOptions)
          .json({ accessKey: token.accessToken, user: userWithoutPassword })
      );
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  async logout(user: User, res: Response) {
    try {
      user.token = null;
      await user.save();
      // res.clearCookie(this.cookieName, this.cookieOptions);
      return res.json({ ok: true });
    } catch (e) {
      return res.json({ error: e.message });
    }
  }
}
