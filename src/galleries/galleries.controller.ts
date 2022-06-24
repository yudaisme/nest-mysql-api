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
  	UseGuards
} from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { GalleriesDTO } from './galleries.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from  'path';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';

@Controller('galleries')
export class GalleriesController {
	constructor(private galleriesService: GalleriesService) {}
	@Get()
	async showAllGalleries() {
		return await this.galleriesService.showAll();
	}

	@Post('upload')
	@UseGuards(JwtAuthenticationGuard)
	@UseInterceptors(
		FileInterceptor(
			'file', 
			{
        		storage: diskStorage({
          			destination: './files', 
	          		filename: (req, file, cb) => {
	          			const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
	          			return cb(null, `${randomName}${extname(file.originalname)}`)
	        		}
        		})
    		}
    	)
	)
  	async createGalleries(@UploadedFile() file, @Body() data: GalleriesDTO, @Req() req) {
    	data.filename = file.filename;
    	data.title = req.body.title;
    	return await this.galleriesService.create(data);
  	}

  	@Get(':id')
  	async readGallery(@Param('id') id: number) {
	    return await this.galleriesService.read(id);
  	}

  	@Patch('upload/:id')
  	@UseGuards(JwtAuthenticationGuard)
  	@UseInterceptors(
		FileInterceptor(
			'file', 
			{
        		storage: diskStorage({
          			destination: './files', 
	          		filename: (req, file, cb) => {
	          			const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
	          			return cb(null, `${randomName}${extname(file.originalname)}`)
	        		}
        		})
    		}
    	)
	)
  	async updateGallery(@UploadedFile() file, @Param('id') id: number, @Body() data: Partial<GalleriesDTO>, @Req() req) {
  		data.filename = file.filename
  		data.title = req.body.title
	    return await this.galleriesService.update(id, data);
  	}

  	@Delete(':id')
  	@UseGuards(JwtAuthenticationGuard)
  	async deleteGallery(@Param('id') id: number) {
	    return await this.galleriesService.destroy(id);
  	}
}
