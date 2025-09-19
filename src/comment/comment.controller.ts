import { Controller, Post, Body, Param, UseGuards, Request, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CommentsService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('images')
export class CommentsController {
	constructor(private service: CommentsService) {}

	@UseGuards(JwtAuthGuard)
	@Post(':id/comments')
	async create(@Param('id') id: string, @Body() dto: CreateCommentDto, @Request() req) {
		return this.service.create(id, req.user.userId, dto.text);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':imageId/comments/:id')
	async delete(@Param('id') id: string, @Request() req) {
		await this.service.delete(id, req.user.userId);
		return { message: 'Deleted' };
	}
}
