import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/users/entities/user.entity';
import { CommentsService } from './comment.service';
import { CommentsController } from './comment.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Comment, Image, User])],
	providers: [CommentsService],
	controllers: [CommentsController],
})
export class CommentsModule {}
