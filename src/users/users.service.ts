import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private repo: Repository<User>) { }

	async findById(id: string) {
		const user = await this.repo.findOne({ where: { id } });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async deleteUser(id: string) {
		const user = await this.findById(id);
		await this.repo.remove(user);
	}
}
