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
		return await this.blogsRepository.find();
	}

	async create(data: BlogsDTO) {
	    const user = this.blogsRepository.create(data);
	    await this.blogsRepository.save(data);
	    return user;
	}

	async read(id: number) {
	    return await this.blogsRepository.findOne({ where: { id: id } });
	}

	async update(id: number, data: Partial<BlogsDTO>) {
	    await this.blogsRepository.update({ id }, data);
	    return await this.blogsRepository.findOne({
	      	where: {
	        	id: id,
	      	},
	    });
	}

	async destroy(id: number) {
	    await this.blogsRepository.delete({ id });
	    return { deleted: true };
	}
}
