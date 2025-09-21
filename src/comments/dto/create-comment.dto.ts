import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentDto {
	@ApiProperty({
		example: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry...',
		description: 'Comment text',
	})
	@IsString()
	@MinLength(10)
	@MaxLength(1000)
	text: string;
}
