import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/entities/comments.entity';
import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Comment, Image, User])],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule { }
