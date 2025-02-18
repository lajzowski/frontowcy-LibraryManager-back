import { IsNumber, IsString } from 'class-validator';
export class AuthLoginDto {
  @IsNumber()
  cardNumber: number;

  @IsString()
  password: string;
}
