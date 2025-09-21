import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UploadImageDto {
	@ApiProperty({
		example: 'My cool portfolio image',
		description: 'Portfolio image name',
	})
	@IsString()
	@MinLength(6)
	@MaxLength(100)
	name: string;

	@ApiProperty({
		example: 'My cool portfolio description',
		description: 'Portfolio image description',
	})
	@IsString()
	@MinLength(10)
	@MaxLength(1000)
	description: string;
}
