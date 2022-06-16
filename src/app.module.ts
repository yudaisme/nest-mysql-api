import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersEntity } from './users/users.entity';
import { BlogsModule } from './blogs/blogs.module';
import { BlogsEntity } from './blogs/blogs.entity';
import { GalleriesModule } from './galleries/galleries.module';
import { GalleriesEntity } from './galleries/galleries.entity';

import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestjs_mysql_crud_app',
      synchronize: true,
      logging: true,
      entities: [UsersEntity, BlogsEntity, GalleriesEntity],
    }),
    MulterModule.register({
      dest: './files',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    UsersModule,
    BlogsModule,
    GalleriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
