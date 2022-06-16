import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleriesEntity } from './galleries.entity';
import { GalleriesDTO } from './galleries.dto';

@Injectable()
export class GalleriesService {
	constructor(
		@InjectRepository(GalleriesEntity)
		private galleriesRepository: Repository<GalleriesEntity>,
	) {}

	async showAll() {
		return await this.galleriesRepository.find();
	}

	async create(data: GalleriesDTO) {
	    const gallery = this.galleriesRepository.create(data);
	    await this.galleriesRepository.save(data);
	    return gallery;
	}

	async read(id: number) {
	    return await this.galleriesRepository.findOne({ where: { id: id } });
	}

	async update(id: number, data: Partial<GalleriesDTO>) {
	    await this.galleriesRepository.update({ id }, data);
	    return await this.galleriesRepository.findOne({
	      	where: {
	        	id: id,
	      	},
	    });
	}

	async destroy(id: number) {
	    await this.galleriesRepository.delete({ id });
	    return { deleted: true };
	}
}
