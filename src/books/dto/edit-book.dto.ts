import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class EditBookDto {
  @IsUUID()
  id: string;

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
