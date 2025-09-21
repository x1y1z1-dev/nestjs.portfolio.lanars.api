import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Partial<Repository<User>>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hashed',
    currentHashedRefreshToken: 'refreshHash',
  } as User;

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    jwtService = { signAsync: jest.fn(), verify: jest.fn() };
    configService = { get: jest.fn().mockReturnValue('1h') };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should throw conflict if user exists', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.signup('test@example.com', '123456', 'Test')).rejects.toThrow(HttpException);
    });

    it('should create and save a new user', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(null);
      (userRepo.save as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

      const result = await service.signup('test@example.com', '123456', 'Test');

      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('validateUser', () => {
    it('should throw if user not found', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.validateUser('test@example.com', '123')).rejects.toThrow(HttpException);
    });

    it('should throw if password incorrect', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrong')).rejects.toThrow(HttpException);
    });

    it('should return user if valid', async () => {
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', '123456');
      expect(result).toEqual(mockUser);
    });
  });

  describe('generateJwt', () => {
    it('should call jwtService.signAsync and return token', async () => {
      (jwtService.signAsync as jest.Mock).mockResolvedValue('token');
      const token = await service.generateJwt(mockUser);
      expect(token).toBe('token');
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockUser.id, email: mockUser.email },
        { expiresIn: '1h' },
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate refresh token and hash it', async () => {
      (jwtService.signAsync as jest.Mock).mockResolvedValue('refresh-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-token');

      const token = await service.generateRefreshToken(mockUser);

      expect(token).toBe('refresh-token');
      expect(userRepo.update).toHaveBeenCalledWith(mockUser.id, { currentHashedRefreshToken: 'hashed-token' });
    });
  });

  describe('invalidateRefreshToken', () => {
    it('should call userRepo.update', async () => {
      await service.invalidateRefreshToken('1');
      expect(userRepo.update).toHaveBeenCalledWith('1', { currentHashedRefreshToken: '' });
    });
  });

  describe('validateRefreshToken', () => {
    it('should throw if token invalid', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
      await expect(service.validateRefreshToken('token')).rejects.toThrow(HttpException);
    });

    it('should return user if token valid', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: mockUser.id });
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateRefreshToken('token');
      expect(result).toEqual(mockUser);
    });

    it('should return null if bcrypt compare fails', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: mockUser.id });
      (userRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateRefreshToken('token');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      jest.spyOn(service, 'generateJwt').mockResolvedValue('access-token');
      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: 'access-token' });
    });
  });
});
