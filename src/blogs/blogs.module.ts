import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogsEntity } from './blogs.entity';

@Module({
	imports: [TypeOrmModule.forFeature([BlogsEntity])],
	controllers: [BlogsController],
	providers: [BlogsService],
})
export class BlogsModule {}
