import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { LogAction } from '../../types/log-action.enum';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Logs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (entity) => entity.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Book, (entity) => entity.id, { nullable: true })
  @JoinColumn()
  book: Book | null;

  @Column({
    type: 'bigint',
  })
  cardNumber: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'tinyint', unsigned: true })
  action: LogAction;
}
