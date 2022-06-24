import {
	Controller,
  	Get,
  	Post,
  	Patch,
  	Delete,
  	Body,
  	Param,
  	HttpStatus,
  	UseGuards,
  	Req
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsDTO } from './blogs.dto';
import { CreateBlogDTO } from './dto/createBlog.dto';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';

@Controller('blogs')
export class BlogsController {
	constructor(private blogsService: BlogsService) {}
	@Get()
	async showAllBlogs() {
		return await this.blogsService.showAll();
	}

	@Post()
	@UseGuards(JwtAuthenticationGuard)
  	async createBlogs(@Body() data: CreateBlogDTO, @Req() req: RequestWithUser) {
    	return await this.blogsService.create(data, req.user);
  	}

  	@Get(':id')
  	async readBlog(@Param('id') id: number) {
	    return await this.blogsService.read(id);
  	}

  	@Patch(':id')
  	@UseGuards(JwtAuthenticationGuard)
  	async updateBlog(@Param('id') id: number, @Body() data: Partial<BlogsDTO>) {
	    return await this.blogsService.update(id, data);	    
  	}

  	@Delete(':id')
  	@UseGuards(JwtAuthenticationGuard)
  	async deleteBlog(@Param('id') id: number) {
	    return await this.blogsService.destroy(id);
  	}
}