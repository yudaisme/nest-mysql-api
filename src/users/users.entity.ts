import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany  } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BlogsEntity } from '../blogs/blogs.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken: string;

  @OneToMany(() => BlogsEntity, (blog: BlogsEntity) => blog.user)
  public blogs: BlogsEntity[];
}