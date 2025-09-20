import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/comments/entities/comments.entity';
import { Image } from 'src/images/entities/image.entity';
import { User } from 'src/users/entities/user.entity';

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
		// const c = this.repo.create({ text, image, author: user });
		// return this.repo.save(c);
	}

	async delete(id: string, userId: string) {
		const c = await this.repo.findOne({ where: { id }, relations: ['author'] });
		if (!c) throw new NotFoundException('Comment not found');
		if (!c.author || c.author.id !== userId) throw new Error('Forbidden');
		// await this.repo.remove(c);
	}
}
