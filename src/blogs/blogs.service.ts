import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogsEntity } from './blogs.entity';
import { BlogsDTO } from './blogs.dto';

@Injectable()
export class BlogsService {
	constructor(
		@InjectRepository(BlogsEntity)
		private blogsRepository: Repository<BlogsEntity>,
	) {}

	async showAll() {
		const blogs = await this.blogsRepository.find();

		return {
			statusCode: HttpStatus.OK,
			message: 'Blogs fetched successfully',
			blogs
		}
	}

	async create(data: BlogsDTO) {
	    const blog = this.blogsRepository.create(data);
	    return {
	      statusCode: HttpStatus.OK,
	      message: 'Blog created successfully',
	      blog,
    	};
	}

	async read(id: number) {
	    const data = await this.blogsRepository.findOne({ where: { id: id } });
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog fetched successfully',
	      	data,
	    };
	}

	async update(id: number, data: Partial<BlogsDTO>) {
	    await this.blogsRepository.update({ id }, data);
	    const blog = await this.blogsRepository.findOne({
	      	where: {
	        	id: id,
	      	},
	    });
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog updated successfully',
	      	blog
	    };
	}

	async destroy(id: number) {
	    await this.blogsRepository.delete({ id });
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Blog deleted successfully',
	    };
	}
}
