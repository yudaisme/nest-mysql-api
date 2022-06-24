import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm';
import { UsersEntity } from '../users/users.entity';


@Entity('blogs')
export class BlogsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.blogs)
  public user: UsersEntity;
}