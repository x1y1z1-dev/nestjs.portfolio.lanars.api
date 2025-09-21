import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { Image } from '../images/entities/image.entity';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Comment, Image, User])],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule { }
