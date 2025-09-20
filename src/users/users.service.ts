import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) { }

	async findById(iuserId: string): Promise<User | null> {
		const user = await this.repo.findOne({ where: { id: iuserId } });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async deleteUser(userId: string): Promise<void> {
		const user = await this.findById(userId);
		if (!user) throw new NotFoundException('User not found');
		await this.repo.remove(user);
	}
}
