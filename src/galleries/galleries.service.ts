import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleriesEntity } from './galleries.entity';
import { GalleriesDTO } from './galleries.dto';
import * as fs from 'fs';

@Injectable()
export class GalleriesService {
	constructor(
		@InjectRepository(GalleriesEntity)
		private galleriesRepository: Repository<GalleriesEntity>,
	) {}

	async showAll() {
		const galleries = await this.galleriesRepository.find();
		return {
			statusCode: HttpStatus.OK,
			message: 'galleries fetched successfully',
			galleries
		}
	}

	async create(data: GalleriesDTO) {
	    const gallery = this.galleriesRepository.create(data);
	    await this.galleriesRepository.save(data);
	    return {
	      statusCode: HttpStatus.OK,
	      message: 'gallery created successfully',
	      gallery,
    	};
	}

	async read(id: number) {
	    const data = await this.galleriesRepository.findOne({ where: { id: id } });
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery fetched successfully',
	      	data,
	    };
	}

	async update(id: number, data: Partial<GalleriesDTO>) {
		const oldGallery = await this.galleriesRepository.findOne({
			where: {
				id: id
			}
		})
		await fs.unlink(__dirname + '../../../files/'+oldGallery.filename, (err) => {
			if (err) {
				console.log(err);
				return err;
			}
		});

	    await this.galleriesRepository.update({ id }, data);

	    const gallery = await this.galleriesRepository.findOne({
	      	where: {
	        	id: id,
	      	},
	    });

	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery updated successfully',
	      	gallery
	    };
	}

	async destroy(id: number) {
		const oldGallery = await this.galleriesRepository.findOne({
			where: {
				id: id
			}
		})
		await fs.unlink(__dirname + '../../../files/'+oldGallery.filename, (err) => {
			if (err) {
				console.log(err);
				return err;
			}
		});
	    await this.galleriesRepository.delete({ id });
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery deleted successfully',
	    };
	}
}
