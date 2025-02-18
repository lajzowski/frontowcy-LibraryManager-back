import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
