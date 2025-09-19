import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfoliosService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
	constructor(private service: PortfoliosService) {}

	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() dto: CreatePortfolioDto, @Request() req) {
		return this.service.create(dto, req.user.userId);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async list(@Request() req) {
		return this.service.findByUser(req.user.userId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string, @Request() req) {
		await this.service.delete(id, req.user.userId);
		return { message: 'Deleted' };
	}
}
