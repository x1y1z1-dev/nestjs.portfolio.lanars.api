import { Controller, Post, Body, UseGuards, Get, Delete, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { PaginatedResult, UserRequest } from 'src/common/types/general.type';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PortfolioResponseDto } from './dto/response-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { PaginationDto } from './dto/pagination-portfolio.dto';

@Controller('portfolios')
export class PortfoliosController {
	constructor(private service: PortfoliosService) { }

	@UseGuards(JwtAuthGuard)
	@Post('create')
	@ApiBearerAuth()
	@ApiResponse({ status: 201, description: 'Portfolio was created successfully' })
	@ApiResponse({ status: 400, description: 'Bad Request – invalid input data' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async create(@Body() dto: CreatePortfolioDto, @GetUser() user: UserRequest): Promise<Portfolio> {
		return await this.service.create(dto, user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('user-list')
	@ApiBearerAuth()
	@ApiResponse({
		status: 200,
		description: 'Returns list of portfolios belonging to the authenticated user',
		type: PortfolioResponseDto,
		isArray: true,
	})
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	async getUserListOfPortfolios(
		@GetUser() user: UserRequest,
		@Query() query: PaginationDto,
	): Promise<PaginatedResult<Portfolio>> {
		return await this.service.findByUserId(user.id, query);
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

	@UseGuards(JwtAuthGuard)
	@Delete('delete/:portfolioId')
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
