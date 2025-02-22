import { IsEmail, IsString, Matches } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Hasło musi mieć minimum 6 znaków, w tym 1 cyfrę i jedną literę.',
  })
  password: string;
}
