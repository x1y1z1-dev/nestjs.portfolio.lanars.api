import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/image/entities/image.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { ImagesService } from './image.service';
import { ImagesController } from './image.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Image, Portfolio, User])],
	providers: [ImagesService],
	controllers: [ImagesController],
})
export class ImagesModule {}
