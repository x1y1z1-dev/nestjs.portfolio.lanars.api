import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/images/entities/image.entity';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImageDiskFactory } from './image.factory';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([Image, Portfolio, User]),
		MulterModule.registerAsync({
			imports: [ImagesModule],
			useClass: ImageDiskFactory,
		}),
	],
	providers: [ImagesService],
	controllers: [ImagesController],
	exports: [ImagesService],
})
export class ImagesModule { }

//TODO: check if the code is okay chatgpt
// import { Image } from 'src/images/entities/image.entity';
// import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
// import { User } from 'src/users/entities/user.entity';
// imports: [TypeOrmModule.forFeature([Image, Portfolio, User])],