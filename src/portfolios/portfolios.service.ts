import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { PaginationDto } from './dto/pagination-portfolio.dto';
import type { PaginatedResult } from 'src/common/types/general.type';

@Injectable()
export class PortfoliosService {
	constructor(
		@InjectRepository(Portfolio) private repo: Repository<Portfolio>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }

	async create(dto: CreatePortfolioDto, userId: string): Promise<Portfolio> {
		const user = await this.userRepo.findOne({ where: { id: userId } });
		if (!user) throw new NotFoundException('User not found');

		const portfolio = this.repo.create({ ...dto, owner: user });
		return this.repo.save(portfolio);
	}

	// async findByUser(userId: string): Promise<Portfolio[] | []> {
	// 	const res = await this.repo.find({
	// 		where: { owner: { id: userId } },
	// 		relations: ['images'],
	// 		order: { createdAt: 'DESC' },
	// 	});
	// 	if (!res || res.length === 0) throw new NotFoundException('Portfolios not found');

	// 	return res;
	// }

	async findByUserId(userId: string, query: PaginationDto): Promise<PaginatedResult<Portfolio>> {
		const [items, total] = await this.repo.findAndCount({
			where: { id: userId },
			relations: ['owner', 'images'],
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' },
		});

		return {
			data: items,
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		};
	}

	async findAll(query: PaginationDto): Promise<PaginatedResult<Portfolio>> {
		const [items, total] = await this.repo.findAndCount({
			relations: ['owner', 'images'],
			skip: (query.page - 1) * query.limit,
			take: query.limit,
			order: { createdAt: 'DESC' },
		});

		return {
			data: items,
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		};
	}

	async delete(portfolioId: string, userId: string): Promise<void> {
		const portfolio = await this.repo.findOne({
			where: { id: portfolioId },
			relations: ['owner'],
		});
		if (!portfolio) throw new NotFoundException('Portfolio not found');

		if (portfolio.owner.id !== userId) throw new ForbiddenException('Not allowed');
		await this.repo.remove(portfolio);
	}
}
