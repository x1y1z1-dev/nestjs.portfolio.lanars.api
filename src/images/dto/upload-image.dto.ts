import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class UploadImageDto {
	@ApiProperty({
		example: 'My cool portfolio image',
		description: 'Portfolio image name',
	})
	@IsString()
	@MaxLength(100)
	name: string;

	@ApiProperty({
		example: 'My cool portfolio description',
		description: 'Portfolio image description',
	})
	@IsString()
	@MaxLength(1000)
	description: string;
}
