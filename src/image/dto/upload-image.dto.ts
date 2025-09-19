import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UploadImageDto {
	@IsString()
	@MaxLength(200)
	name: string;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;
}
