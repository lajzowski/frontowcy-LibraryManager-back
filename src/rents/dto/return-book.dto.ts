import { IsUUID } from 'class-validator';

export class ReturnBookDto {
  @IsUUID()
  id: string;
}
