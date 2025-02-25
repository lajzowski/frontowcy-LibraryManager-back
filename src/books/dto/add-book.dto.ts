import { Column, OneToMany } from 'typeorm';
import { Rent } from '../../rents/entities/rent.entity';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class AddBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  description: string;

  @IsNumber()
  @Min(1)
  @Max(9999)
  count: number;

  @IsString()
  slug: string;
}
