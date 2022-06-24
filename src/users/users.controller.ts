import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDTO } from './users.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async showAllUsers() {
    return await this.usersService.showAll();
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createUsers(@Body() data: UsersDTO) {
    return await this.usersService.create(data);
  }

  @Get(':id')
  async readUser(@Param('id') id: number) {
    return await this.usersService.read(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  async uppdateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    return await this.usersService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.destroy(id);
  }
}
