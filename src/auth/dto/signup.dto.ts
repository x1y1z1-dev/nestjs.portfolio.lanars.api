import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
	@ApiProperty({
		example: 'Tester@gmail.com',
		description: 'User email',
	})
	@IsEmail({}, { message: 'email must be a valid email address' })
	email: string;

	@ApiProperty({
		example: 'Password123!',
		description: 'User password (min 8 characters, 1 letter, 1 number, 1 special char)',
	})
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/, {
		message:
			'Password must be at least 8 characters long, include one letter, one number, and one special character (@$!%*?&_ allowed)',
	})
	password: string;

	@ApiProperty({
		example: 'John Doe',
	})
	@IsString()
	@MinLength(3, { message: 'The name must be at least 3 characters long.' })
	@MaxLength(20, { message: 'The name must be no longer than 20 characters' })
	name: string;
}
