import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePortfolioDto {
	@ApiProperty({
		example: 'My Portfolio',
		description: 'Portfolio name',
	})
	@IsString()
	@MaxLength(100)
	name: string;

	@ApiProperty({
		example: 'This is my personal portfolio showcasing my projects.',
		description: 'Portfolio description',
	})
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description: string;
}
