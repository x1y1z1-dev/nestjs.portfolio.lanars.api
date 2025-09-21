import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Portfolio } from '../portfolios/entities/portfolio.entity';
import { User } from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { join, resolve } from 'path';
import { unlink } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { DiskConfig, DiskConfigName } from 'src/configs/disk.config';

export interface UploadImageParams {
	portfolioId: string;
	name: string;
	description?: string;
	userId: string;
}

@Injectable()
export class ImagesService {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(Image) private repo: Repository<Image>,
		@InjectRepository(Portfolio) private portfolioRepo: Repository<Portfolio>,
		@InjectRepository(User) private userRepo: Repository<User>,
	) { }

	getDiskPath(): string {
		const diskConfig = this.configService.get<DiskConfig>(DiskConfigName)!;
		const uploadPath = join(process.cwd(), diskConfig.path);
		if (!existsSync(uploadPath)) {
			mkdirSync(uploadPath, { recursive: true });
		}
		return uploadPath;
	}

	getFileName(file: Express.Multer.File): string {
		const timestamp = Date.now();
		const originalName = file.originalname.replace(/\s+/g, '_');
		const ext = originalName.split('.').pop();
		return `${timestamp}.${ext}`;
	}

	async upload(file: Express.Multer.File, params: UploadImageParams): Promise<void> {
		const portfolio = await this.portfolioRepo.findOne({ where: { id: params.portfolioId }, relations: ['owner'] });

		if (!portfolio) throw new NotFoundException('Portfolio not found');

		if (portfolio.owner.id !== params.userId) throw new ForbiddenException('Not allowed to upload to this portfolio');

		const user = await this.userRepo.findOne({ where: { id: params.userId } });

		if (!user) throw new NotFoundException('User not found');

		const img = this.repo.create({
			name: params.name,
			description: params.description,
			filePath: file.filename,
			portfolio: portfolio,
			uploader: user,
		});

		await this.repo.save(img);
	}

	async delete(imageId: string, userId: string): Promise<void> {
		const img = await this.repo.findOne({ where: { id: imageId }, relations: ['uploader'] });

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
