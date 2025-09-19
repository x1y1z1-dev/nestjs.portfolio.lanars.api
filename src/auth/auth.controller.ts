import { Body, Controller, Post, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	@ApiResponse({ status: 201, description: 'Return an object with message and access_token fields' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@ApiResponse({ status: 409, description: 'User with this email already exists' })
	async signup(@Body() dto: SignupDto): Promise<{
		access_token: string;
		refresh_token: string;
	}> {
		const user = await this.authService.signup(dto.email, dto.password, dto.name);
		const accessToken = await this.authService.generateJwt(user);
		const refreshToken = await this.authService.generateRefreshToken(user);

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	@Post('login')
	@ApiResponse({ status: 200, description: 'Return an object with access_token field' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	async login(@Body() dto: LoginDto): Promise<{ access_token: string; refresh_token: string }> {
		const user = await this.authService.validateUser(dto.email, dto.password);
		if (!user) throw new UnauthorizedException('Invalid credentials');

		const accessToken = await this.authService.generateJwt(user);
		const refreshToken = await this.authService.generateRefreshToken(user);

		return { access_token: accessToken, refresh_token: refreshToken };
	}

	@Post('refresh-token')
	@ApiResponse({ status: 200, description: 'Return an object with access_token field' })
	@ApiResponse({ status: 401, description: 'Invalid refresh token' })
	async refreshToken(@Body('refresh_token') refreshToken: string): Promise<{ access_token: string }> {
		const user = await this.authService.validateRefreshToken(refreshToken);
		if (!user) throw new UnauthorizedException('Invalid refresh token');

		const accessToken = await this.authService.generateJwt(user);
		return { access_token: accessToken };
	}

	@UseGuards(JwtAuthGuard)
	@Post('logout')
	@ApiResponse({ status: 200, description: 'Logged out successfully' })
	async logout(@GetUser() user: { userId: string; email: string }): Promise<{
		message: string;
	}> {
		await this.authService.invalidateRefreshToken(user.userId);
		return { message: 'Logged out successfully' };
	}
}
