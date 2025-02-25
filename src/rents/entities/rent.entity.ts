import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Rent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (entity) => entity.id)
  @JoinColumn()
  book: Book;

  @ManyToOne(() => User, (entity) => entity.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;

  @Column({
    type: 'bigint',
  })
  cardNumber: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rentDate: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  returnDate: Date | null;
}
