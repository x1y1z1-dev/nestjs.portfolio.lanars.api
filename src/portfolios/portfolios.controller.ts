import { Controller, Post, Body, UseGuards, Get, Delete, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { UserRequest } from 'src/common/types/general.type';
import { ApiResponse } from '@nestjs/swagger';
import { PortfolioResponseDto } from './dto/response-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';

@Controller('portfolios')
export class PortfoliosController {
	constructor(private service: PortfoliosService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiResponse({ status: 201, description: 'Portfolio was created successfully' })
	@ApiResponse({ status: 400, description: 'Bad Request – invalid input data' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async create(@Body() dto: CreatePortfolioDto, @GetUser() user: UserRequest): Promise<Portfolio> {
		return this.service.create(dto, user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	@ApiResponse({
		status: 200,
		description: 'Returns list of portfolios belonging to the authenticated user',
		type: PortfolioResponseDto,
		isArray: true,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	async list(@GetUser() user: UserRequest): Promise<Portfolio[]> {
		return this.service.findByUser(user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	@ApiResponse({ status: 200, description: 'Portfolio was deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized - missing or invalid JWT' })
	@ApiResponse({ status: 403, description: 'Not allowed' })
	@ApiResponse({ status: 404, description: 'Portfolio not found' })
	async delete(@Param('id') id: string, @GetUser() user: UserRequest): Promise<{ message: string }> {
		await this.service.delete(id, user.id);
		return { message: 'Portfolio was deleted successfully' };
	}
}

//TODO: check if need
//TODO: Add /api/portfolios/create? /api/portfolios/delete?
//TODO: розобратся с { id: 'cee6563a-6fb3-4e90-bdc7-5c8f17e97b3c', username: undefined }
//TODO: доробити свагер
