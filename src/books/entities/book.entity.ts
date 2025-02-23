import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rent } from './rent.entity';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  year: number;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    unsigned: true,
  })
  count: number;

  @Column({
    default: false,
  })
  removed: boolean;

  @OneToMany(() => Rent, (entity) => entity.book)
  rents: Rent[];

  @Column({
    unique: true,
  })
  slug: string;
}
