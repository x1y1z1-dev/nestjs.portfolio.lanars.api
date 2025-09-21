import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    validateUser: jest.fn(),
    generateJwt: jest.fn(),
    generateRefreshToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    invalidateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call authService.signup and return message', async () => {
      const dto: SignupDto = { email: 'test@example.com', password: '123456', name: 'Test User' };
      mockAuthService.signup.mockResolvedValueOnce(undefined);

      const result = await controller.signup(dto);

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto.email, dto.password, dto.name);
      expect(result).toEqual({ message: 'User created' });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if validateUser returns null', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: 'wrong' };
      mockAuthService.validateUser.mockResolvedValueOnce(null);

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('should return access and refresh tokens on successful login', async () => {
      const dto: LoginDto = { email: 'test@example.com', password: '123456' };
      const user = { id: 'user-id', email: dto.email };
      mockAuthService.validateUser.mockResolvedValueOnce(user);
      mockAuthService.generateJwt.mockResolvedValueOnce('access-token');
      mockAuthService.generateRefreshToken.mockResolvedValueOnce('refresh-token');

      const result = await controller.login(dto);

      expect(result).toEqual({ access_token: 'access-token', refresh_token: 'refresh-token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.generateJwt).toHaveBeenCalledWith(user);
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith(user);
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockAuthService.validateRefreshToken.mockResolvedValueOnce(null);

      await expect(controller.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should return new access token for valid refresh token', async () => {
      const user = { id: 'user-id' };
      mockAuthService.validateRefreshToken.mockResolvedValueOnce(user);
      mockAuthService.generateJwt.mockResolvedValueOnce('new-access-token');

      const result = await controller.refreshToken('valid-token');

      expect(result).toEqual({ access_token: 'new-access-token' });
      expect(mockAuthService.validateRefreshToken).toHaveBeenCalledWith('valid-token');
      expect(mockAuthService.generateJwt).toHaveBeenCalledWith(user);
    });
  });

  describe('logout', () => {
    it('should call invalidateRefreshToken and return message', async () => {
      const user = { id: 'user-id' };
      mockAuthService.invalidateRefreshToken.mockResolvedValueOnce(undefined);

      const result = await controller.logout(user as any);

      expect(mockAuthService.invalidateRefreshToken).toHaveBeenCalledWith(user.id);
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
