import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
	@IsString()
	@MaxLength(100)
	name: string;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;
}
