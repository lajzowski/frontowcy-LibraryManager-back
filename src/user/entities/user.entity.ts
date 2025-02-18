import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  firstname: string;

  @Column({
    length: 50,
  })
  lastname: string;

  @Column({
    type: 'bigint',
    unique: true,
  })
  cardNumber: number;

  @Column({ select: false })
  password: string;

  @Column({
    nullable: true,
    default: null,
    select: false,
    type: 'varchar',
  })
  token: string | null;

  @Column({
    length: 80,
    default: '',
    //select: false,
  })
  rule: string;

  @Column({
    unique: true,
  })
  email: string;
}
