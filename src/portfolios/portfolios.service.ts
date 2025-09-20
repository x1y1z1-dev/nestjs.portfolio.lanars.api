import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfoliosService {
	constructor(
		@InjectRepository(Portfolio) private repo: Repository<Portfolio>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }

	async create(dto: CreatePortfolioDto, userId: string) {
		const user = await this.userRepo.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');

		const portfolio = this.repo.create({ ...dto, owner: user });
		return this.repo.save(portfolio);
	}

	async findByUser(userId: string) {
		return this.repo.find({
			where: { owner: { id: userId } },
			relations: ['images'],
			order: { createdAt: 'DESC' },
		});
	}

	async delete(portfolioId: string, userId: string) {
		const portfolio = await this.repo.findOne({
			where: { id: portfolioId },
			relations: ['owner'],
		});
		if (!portfolio) throw new NotFoundException('Portfolio not found');

		if (portfolio.owner.id !== userId) throw new ForbiddenException('Not allowed');
		await this.repo.remove(portfolio);
	}

	async findById(id: string) {
		const portfolio = await this.repo.findOne({
			where: { id },
			relations: ['owner', 'images'],
		});

		if (!portfolio) throw new NotFoundException('Portfolio not found');
		return portfolio;
	}
}
