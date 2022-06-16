import {
	Controller,
  	Get,
  	Post,
  	Patch,
  	Delete,
  	Body,
  	Param,
  	HttpStatus,
  	UploadedFile,
  	UseInterceptors,
  	Req,
} from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesDTO } from './galleries.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from  'path';

@Controller('galleries')
export class GalleriesController {
	constructor(private galleriesService: GalleriesService) {}
	@Get()
	async showAllGalleries() {
		const galleries = await this.galleriesService.showAll();
		return {
			statusCode: HttpStatus.OK,
			message: 'galleries fetched successfully',
			galleries
		}
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
          	destination: './files', 
          	filename: (req, file, cb) => {
          	const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
          	return cb(null, `${randomName}${extname(file.originalname)}`)
        }
        })
      }))
  	async createGalleries(@UploadedFile() file, @Body() data: GalleriesDTO, @Req() req) {
    	data.filename = file.filename;
    	data.title = req.body.title;
    	const gallery = await this.galleriesService.create(data);
    	return {
	      statusCode: HttpStatus.OK,
	      message: 'gallery created successfully',
	      gallery,
    	};
  	}

  	@Get(':id')
  	async readGallery(@Param('id') id: number) {
	    const data =  await this.galleriesService.read(id);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery fetched successfully',
	      	data,
	    };
  	}

  	@Patch(':id')
  	async updateGallery(@Param('id') id: number, @Body() data: Partial<GalleriesDTO>) {
	    await this.galleriesService.update(id, data);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery updated successfully',
	    };
  	}

  	@Delete(':id')
  	async deleteGallery(@Param('id') id: number) {
	    await this.galleriesService.destroy(id);
	    return {
	      	statusCode: HttpStatus.OK,
	      	message: 'Gallery deleted successfully',
	    };
  	}
}
