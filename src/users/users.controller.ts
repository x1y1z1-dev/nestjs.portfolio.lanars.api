import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUser } from '../common/decorators/get-user.decorator';
import type { UserRequest } from '../common/types/general.type';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Return current user profile' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async getMe(@GetUser() user: UserRequest): Promise<User> {
		console.log(user);
		return await this.usersService.findById(user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'User deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async deleteMe(@GetUser() user: UserRequest): Promise<{ message: string }> {
		await this.usersService.deleteUser(user.id);
		return { message: 'User deleted successfully' };
	}
}
