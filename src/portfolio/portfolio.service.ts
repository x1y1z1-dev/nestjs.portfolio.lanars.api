import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Injectable()
export class PortfoliosService {
	constructor(
		@InjectRepository(Portfolio) private repo: Repository<Portfolio>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) {}

	async create(dto: CreatePortfolioDto, userId: string) {
		const user = await this.userRepo.findOne({ where: { id: userId } });
		// const p = this.repo.create({ ...dto, owner: user });
		// return this.repo.save(p);
	}

	async findByUser(userId: string) {
		return this.repo.find({ where: { owner: { id: userId } }, relations: ['images'] });
	}

	async delete(portfolioId: string, userId: string) {
		const p = await this.repo.findOne({ where: { id: portfolioId }, relations: ['owner'] });
		if (!p) throw new NotFoundException('Portfolio not found');
		if (p.owner.id !== userId) throw new ForbiddenException('Not allowed');
		await this.repo.remove(p);
	}

	async findById(id: string) {
		const p = await this.repo.findOne({ where: { id }, relations: ['owner', 'images'] });
		if (!p) throw new NotFoundException('Portfolio not found');
		return p;
	}
}
