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
		const blogs = await this.blogsService.showAll();
		return {
			statusCode: HttpStatus.OK,
			message: 'Blogs fetched successfully',
			blogs
		}
	}

	@Post()
  	async createBlogs(@Body() data: BlogsDTO) {
    	const blog = await this.blogsService.create(data);
    	return {
	      statusCode: HttpStatus.OK,
	      message: 'Blog created successfully',
	      blog,
    	};
  	}

  	@Get(':id')
  	async readBlog(@Param('id') id: number) {
	    const data =  await this.blogsService.read(id);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog fetched successfully',
	      	data,
	    };
  	}

  	@Patch(':id')
  	async updateBlog(@Param('id') id: number, @Body() data: Partial<BlogsDTO>) {
	    await this.blogsService.update(id, data);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog updated successfully',
	    };
  	}

  	@Delete(':id')
  	async deleteBlog(@Param('id') id: number) {
	    await this.blogsService.destroy(id);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog deleted successfully',
	    };
  	}
}