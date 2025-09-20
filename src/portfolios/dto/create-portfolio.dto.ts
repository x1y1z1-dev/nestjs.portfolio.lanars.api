import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePortfolioDto {
	@ApiProperty({
		example: 'My Portfolio',
		description: 'Portfolio name',
	})
	@IsString()
	@MinLength(6)
	@MaxLength(100)
	name: string;

	@ApiProperty({
		example: 'This is my personal portfolio showcasing my projects.',
		description: 'Portfolio description',
	})
	@IsString()
	@MinLength(10)
	@MaxLength(1000)
	description: string;
}
