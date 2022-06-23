import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersEntity } from './users.entity';
import { UsersDTO } from './users.dto';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async showAll() {
    const users = await this.usersRepository.find();
    return {
      statusCode: HttpStatus.OK,
      message: 'Users fetched successfully',
      users,
    };
  }

  async create(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    await this.usersRepository.save(data);
    return {
      statusCode: HttpStatus.OK,
      message: 'User created successfully',
      user,
    };
  }

  async findByEmail(email: string): Promise<UsersDTO> {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async read(id: number) {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    return {
      statusCode: HttpStatus.OK,
      message: 'User fetched successfully',
      user,
    };
  }

  async update(id: number, data: Partial<UsersDTO>) {
    await this.usersRepository.update({ id }, data);
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      user
    };
  }

  async destroy(id: number) {
    await this.usersRepository.delete({ id });
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email
      }
    });

    if(user) {
      return user;
    }
    throw new HttpException('User with that email does not exists', HttpStatus.NOT_FOUND);
  }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id
      }
    });

    if(user){
      return user;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if(isRefreshTokenMatching){
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }
}
