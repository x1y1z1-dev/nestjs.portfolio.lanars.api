import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class LoginDto {
	@ApiProperty({
		example: 'Tester@gmail.com',
		description: 'User email',
	})
	@IsEmail({}, { message: 'email must be a valid email address' })
	email: string;

	@ApiProperty({
		example: 'strongPassword123',
		description: 'User password',
	})
	@IsString()
	@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/, {
		message:
			'Password must be at least 8 characters long, include one letter, one number, and one special character (@$!%*?&_ allowed)',
	})
	password: string;
}
