import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsEntity } from '../news/dtos/news.entity';
import { CommentsEntity } from '../news/dtos/comments.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  /*@Column('text')
  lastName: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;*/

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

  // @ManyToOne(() => CategoriesEntity, (category) => category.news)
  // category: CategoriesEntity;
  //
  // @ManyToOne(() => UsersEntity, (user) => user.news)
  // user: UsersEntity;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
