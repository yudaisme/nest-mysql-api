import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleriesService } from './galleries.service';
import { GalleriesController } from './galleries.controller';
import { GalleriesEntity } from './galleries.entity';

@Module({
	imports: [TypeOrmModule.forFeature([GalleriesEntity])],
	controllers: [GalleriesController],
	providers: [GalleriesService],
})
export class GalleriesModule {}
