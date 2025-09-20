import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from 'src/images/entities/image.entity';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { DiskConfig, DiskConfigName } from 'src/configs/disk.config';
import { extname, resolve } from 'path';
import { unlink } from 'fs/promises';

@Injectable()
export class ImagesService {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(Image) private repo: Repository<Image>,
		@InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }

	getDiskPath() {
		const diskConfig = this.configService.getOrThrow<DiskConfig>(DiskConfigName);

		return resolve(__dirname, '../..', diskConfig.path);
	}

	getFileName(file: Express.Multer.File) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = extname(file.originalname).toLowerCase();
		const name = file.originalname.replace(/\s/g, '-').replace(ext, '');

		return `${name}_${uniqueSuffix}${ext}`;
	}
	async upload(portfolioId: string, filename: string, name: string, description: string, userId: string) {
		const portfolio = await this.portfolioRepo.findOne({ where: { id: portfolioId }, relations: ['owner'] });

		if (!portfolio) throw new NotFoundException('Portfolio not found');

		if (portfolio.owner.id !== userId) throw new ForbiddenException('Not allowed to upload to this portfolio');

		const user = await this.userRepo.findOne({ where: { id: userId } });

		if (!user) throw new NotFoundException('User not found');

		const img = this.repo.create({
			name: name,
			description: description,
			filePath: filename,
			portfolio: portfolio,
			uploader: user,
		});

		return this.repo.save(img);
	}

	async delete(id: string, userId: string) {
		const img = await this.repo.findOne({ where: { id }, relations: ['uploader'] });

		if (!img) throw new NotFoundException('Image not found');

		if (!img.uploader || img.uploader.id !== userId) throw new ForbiddenException('Not allowed');

		const filePath = resolve(this.getDiskPath(), img.filePath);

		try {
			await unlink(filePath);
		} catch {
			throw new ForbiddenException('File not found or cannot be deleted');
		}

		await this.repo.remove(img);
	}
}
