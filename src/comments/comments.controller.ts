import { Controller, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { UserRequest } from 'src/common/types/general.type';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ApiResponse } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
	constructor(private service: CommentsService) { }

	@UseGuards(JwtAuthGuard)
	@Post('/:imageId')
	@ApiResponse({ status: 201, description: 'Comment response' })
	@ApiResponse({ status: 404, description: 'Image not found' })
	async create(@Param('imageId') imageId: string, @Body() dto: CreateCommentDto, @GetUser() user: UserRequest) {
		return await this.service.create(imageId, user.id, dto.text);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:commentId')
	@ApiResponse({ status: 200, description: 'Comment Deleted' })
	@ApiResponse({ status: 403, description: 'Not allowed' })
	@ApiResponse({ status: 404, description: 'Comment not found' })
	async delete(@Param('commentId') commentId: string, @GetUser() user: UserRequest) {
		console.log(commentId, user);
		await this.service.delete(commentId, user.id);
		return { message: 'Comment Deleted' };
	}
}

//TODO: check all response ts contollers and services and other help functions conf, filter, fecorators
//TODO: improve swager documentation, check status codes and messages
//TODO: check min max values for fields strings if empty and others
//TODO: ADD seed fake data
//TODO: add test
//TODO: check index DB
