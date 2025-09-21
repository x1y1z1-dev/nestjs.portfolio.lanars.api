import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) { }

	async findById(iuserId: string): Promise<User> {
		const user = await this.repo.findOne({
			where: { id: iuserId },
			relations: ['portfolios', 'portfolios.images', 'portfolios.images.comments'],
		});
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async deleteUser(userId: string): Promise<void> {
		const user = await this.findById(userId);
		await this.repo.remove(user);
	}
}
