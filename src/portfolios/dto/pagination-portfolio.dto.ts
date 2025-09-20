import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
	@ApiProperty({
		example: 1,
		description: 'Portfolio page number',
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page: number = 1;

	@ApiProperty({
		example: 10,
		description: 'Portfolio limit per page',
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit: number = 10;
}
