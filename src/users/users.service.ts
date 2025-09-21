import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) { }

	async findById(iuserId: string): Promise<User | null> {
		return await this.repo.findOne({ where: { id: iuserId } });
	}

	async deleteUser(userId: string): Promise<void> {
		const user = await this.findById(userId);
		if (!user) throw new NotFoundException('User not found');
		await this.repo.remove(user);
	}
}
