import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
	constructor(
		private configService: ConfigService,
		@InjectRepository(User) private userRepo: Repository<User>,
		private jwtService: JwtService,
	) { }

	async signup(email: string, password: string, name: string): Promise<User> {
		const existing = await this.userRepo.findOne({ where: { email } });

		if (existing) throw new HttpException(`User with this email: { ${email} } already exists`, HttpStatus.CONFLICT);

		const passwordHash = await bcrypt.hash(password, 10);
		const newUser = this.userRepo.create({ email, passwordHash, name });

		return await this.userRepo.save(newUser);
	}

	async validateUser(email: string, pass: string): Promise<User | null> {
		const user = await this.userRepo.findOne({ where: { email } });

		if (!user) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

		const isCorrectPassword = await bcrypt.compare(pass, user.passwordHash);

		if (!isCorrectPassword) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

		return user;
	}

	async generateJwt(user: User): Promise<string> {
		return this.jwtService.signAsync(
			{ sub: user.id, email: user.email },
			{
				expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
			},
		);
	}

	async generateRefreshToken(user: User): Promise<string> {
		const refreshToken = await this.jwtService.signAsync(
			{ sub: user.id },
			{
				expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'),
			},
		);

		const hashedToken = await bcrypt.hash(refreshToken, 10);
		await this.userRepo.update(user.id, { currentHashedRefreshToken: hashedToken });

		return refreshToken;
	}

	async invalidateRefreshToken(userId: string): Promise<void> {
		await this.userRepo.update(userId, { currentHashedRefreshToken: '' });
	}

	async validateRefreshToken(token: string): Promise<User | null> {
		try {
			const payload = this.jwtService.verify<{ sub: string }>(token);
			const userId = payload.sub;

			const user = await this.userRepo.findOne({ where: { id: userId } });
			if (!user || !user.currentHashedRefreshToken)
				throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);

			const isValid = await bcrypt.compare(token, user.currentHashedRefreshToken);
			return isValid ? user : null;
		} catch {
			throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
		}
	}

	async login(user: User): Promise<{ access_token: string }> {
		const token = await this.generateJwt(user);
		return {
			access_token: token,
		};
	}
}
