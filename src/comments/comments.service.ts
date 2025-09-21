import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { Image } from '../images/entities/image.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(Comment) private repo: Repository<Comment>,
		@InjectRepository(Image) private imageRepo: Repository<Image>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }

	async create(imageId: string, userId: string, text: string) {
		const image = await this.imageRepo.findOne({ where: { id: imageId } });

		if (!image) throw new NotFoundException('Image not found');

		const user = await this.userRepo.findOne({ where: { id: userId } });

		if (!user) throw new NotFoundException('User not found');

		const comment = this.repo.create({ text, image, author: user });
		return this.repo.save(comment);
	}

	async delete(commentId: string, userId: string) {
		const comment = await this.repo.findOne({ where: { id: commentId }, relations: ['author'] });

		if (!comment) throw new NotFoundException('Comment not found');
		if (!comment.author || comment.author.id !== userId) throw new ForbiddenException('Not allowed');

		return await this.repo.remove(comment);
	}
}
