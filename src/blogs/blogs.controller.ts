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
import { BlogsService } from './blogs.service';
import { BlogsDTO } from './blogs.dto';

@Controller('blogs')
export class BlogsController {
	constructor(private blogsService: BlogsService) {}
	@Get()
	async showAllBlogs() {
		return await this.blogsService.showAll();
	}

	@Post()
  	async createBlogs(@Body() data: BlogsDTO) {
    	return await this.blogsService.create(data);
  	}

  	@Get(':id')
  	async readBlog(@Param('id') id: number) {
	    return await this.blogsService.read(id);
  	}

  	@Patch(':id')
  	async updateBlog(@Param('id') id: number, @Body() data: Partial<BlogsDTO>) {
	    return await this.blogsService.update(id, data);	    
  	}

  	@Delete(':id')
  	async deleteBlog(@Param('id') id: number) {
	    return await this.blogsService.destroy(id);
  	}
}