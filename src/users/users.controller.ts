import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDTO } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  async showAllUsers() {
    return await this.usersService.showAll();
  }

  @Post()
  async createUsers(@Body() data: UsersDTO) {
    return await this.usersService.create(data);
  }

  @Get(':id')
  async readUser(@Param('id') id: number) {
    return await this.usersService.read(id);
  }

  @Patch(':id')
  async uppdateUser(@Param('id') id: number, @Body() data: Partial<UsersDTO>) {
    return await this.usersService.update(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.usersService.destroy(id);
  }
}
