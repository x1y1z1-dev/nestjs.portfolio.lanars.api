import { Controller, Post, Body, UseGuards, Get, Delete, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { PaginatedResult, UserRequest } from '../common/types/general.type';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PortfolioResponseDto } from './dto/response-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { PaginationDto } from './dto/pagination-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
	constructor(private service: PortfoliosService) { }

	@UseGuards(JwtAuthGuard)
	@Post()
	@ApiBearerAuth()
	@ApiResponse({ status: 201, description: 'Portfolio was created successfully' })
	@ApiResponse({ status: 400, description: 'Bad Request – invalid input data' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async create(@Body() dto: CreatePortfolioDto, @GetUser() user: UserRequest): Promise<Portfolio> {
		return await this.service.create(dto, user.id);
	}

	@Get('user-list/:userId')
	@ApiResponse({
		status: 200,
		description: 'Returns list of portfolios belonging to the user',
		type: PortfolioResponseDto,
		isArray: true,
	})
	async getUserListOfPortfolios(
		@Param('userId') userId: string,
		@Query() query: PaginationDto,
	): Promise<PaginatedResult<Portfolio>> {
		return await this.service.findByUserId(userId, query);
	}

	@Get('get-list')
	@ApiResponse({
		status: 200,
		description: 'Returns list of portfolios ',
		type: PortfolioResponseDto,
		isArray: true,
	})
	async getListOfPortfolios(@Query() query: PaginationDto): Promise<PaginatedResult<Portfolio>> {
		return await this.service.findAll(query);
	}

	@Get(':portfolioId')
	@ApiResponse({
		status: 200,
		description: 'Returns portfolio by ID',
		type: PortfolioResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Portfolio not found' })
	async getPortfolioById(@Param('portfolioId') portfolioId: string): Promise<Portfolio> {
		return await this.service.findByPortfolioId(portfolioId);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/:portfolioId')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Portfolio was deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized - missing or invalid JWT' })
	@ApiResponse({ status: 403, description: 'Not allowed' })
	@ApiResponse({ status: 404, description: 'Portfolio not found' })
	async delete(@Param('portfolioId') portfolioId: string, @GetUser() user: UserRequest): Promise<{ message: string }> {
		await this.service.delete(portfolioId, user.id);
		return { message: 'Portfolio was deleted successfully' };
	}
}
