import { Body, Controller, Post, UseGuards, UnauthorizedException, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RefreshTokenResponseDto } from './dto/refresh_response.dto';
import { LoginTokenResponseDto } from './dto/login_response.dto';
import type { UserRequest } from '../common/types/general.type';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('signup')
	@ApiResponse({ status: 201, description: 'User created' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@ApiResponse({ status: 409, description: 'User with this email already exists' })
	async signup(@Body() dto: SignupDto): Promise<{
		message: string;
	}> {
		await this.authService.signup(dto.email, dto.password, dto.name);
		return { message: 'User created' };
	}

	@Post('login')
	@ApiResponse({
		status: 200,
		description: 'access_token and refresh_token',
		type: LoginTokenResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	async login(@Body() dto: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
		const user = await this.authService.validateUser(dto.email, dto.password);
		if (!user) throw new UnauthorizedException('Invalid credentials');

		const accessToken = await this.authService.generateJwt(user);
		const refreshToken = await this.authService.generateRefreshToken(user);

		return { access_token: accessToken, refresh_token: refreshToken };
	}

	@Post('refresh-token')
	@ApiBody({
		description: 'Refresh tocken',
		schema: {
			type: 'object',
			properties: {
				refresh_token: { type: 'string', description: 'Refresh tocken' },
			},
			required: ['refresh_token'],
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Return an object with access_token field',
		type: RefreshTokenResponseDto,
	})
	@ApiResponse({ status: 200, description: 'Return an object with access_token field' })
	@ApiResponse({ status: 401, description: 'Invalid refresh token' })
	async refreshToken(@Body('refresh_token') refreshToken: string): Promise<{ access_token: string }> {
		const user = await this.authService.validateRefreshToken(refreshToken);
		if (!user) throw new UnauthorizedException('Invalid refresh token');

		const accessToken = await this.authService.generateJwt(user);
		return { access_token: accessToken };
	}

	@UseGuards(JwtAuthGuard)
	@Delete('logout')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Logged out successfully' })
	@ApiResponse({ status: 404, description: 'User not found' })
	async logout(@GetUser() @GetUser() user: UserRequest): Promise<{
		message: string;
	}> {
		await this.authService.invalidateRefreshToken(user.id);
		return { message: 'Logged out successfully' };
	}
}
