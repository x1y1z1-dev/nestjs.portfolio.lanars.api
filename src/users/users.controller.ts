import { Controller, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import type { UserRequest } from 'src/common/types/general.type';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService) { }

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@ApiResponse({ status: 200, description: 'User deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized – missing or invalid JWT' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async deleteMe(@GetUser() user: UserRequest): Promise<{ message: string }> {
		await this.usersService.deleteUser(user.id);
		return { message: 'User deleted successfully' };
	}
}
