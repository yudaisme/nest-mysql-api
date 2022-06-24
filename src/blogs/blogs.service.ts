import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogsEntity } from './blogs.entity';
import { UsersEntity } from '../users/users.entity';
import { BlogsDTO } from './blogs.dto';
import { CreateBlogDTO } from './dto/createBlog.dto';

@Injectable()
export class BlogsService {
	constructor(
		@InjectRepository(BlogsEntity)
		private blogsRepository: Repository<BlogsEntity>,
	) {}

	async showAll() {
		const blogs = await this.blogsRepository.find({
			relations: {
				user: true
			}
		});

		return {
			statusCode: HttpStatus.OK,
			message: 'Blogs fetched successfully',
			blogs
		}
	}

	async create(data: CreateBlogDTO, user: UsersEntity) {
	    const blog = this.blogsRepository.create({
	    	...data,
	    	user: user
	    });
	    await this.blogsRepository.save(blog);
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
