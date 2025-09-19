import { Controller, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@ApiResponse({ status: 200, description: 'User deleted successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	async deleteMe(@GetUser() user: { userId: string; email: string }): Promise<{
		message: string;
	}> {
		console.log(user);
		await this.usersService.deleteUser(user.userId);
		return { message: 'User deleted successfully' };
	}
}
