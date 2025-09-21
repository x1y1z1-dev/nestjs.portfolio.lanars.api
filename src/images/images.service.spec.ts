import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService, UploadImageParams } from './images.service';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '../common/logger/logger.service';
import { Repository } from 'typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import fs from 'fs';

jest.mock('fs/promises');
jest.mock('fs');

describe('ImagesService', () => {
  let service: ImagesService;
  let repoMock: Partial<Repository<any>>;
  let portfolioRepoMock: Partial<Repository<any>>;
  let userRepoMock: Partial<Repository<any>>;
  let configServiceMock: Partial<ConfigService>;
  let loggerMock: Partial<AppLogger>;

  beforeEach(async () => {
    repoMock = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
    };

    portfolioRepoMock = {
      findOne: jest.fn(),
    };

    userRepoMock = {
      findOne: jest.fn(),
    };

    configServiceMock = {
      get: jest.fn().mockReturnValue({ path: 'uploads' }),
    };

    loggerMock = {
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: AppLogger, useValue: loggerMock },
        { provide: 'ImageRepository', useValue: repoMock },
        { provide: 'PortfolioRepository', useValue: portfolioRepoMock },
        { provide: 'UserRepository', useValue: userRepoMock },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDiskPath', () => {
    it('should create folder if not exists', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync');

      const path = service.getDiskPath();

      expect(mkdirSpy).toHaveBeenCalled();
      expect(path).toContain('uploads');
    });

    it('should return path if exists', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      const path = service.getDiskPath();
      expect(path).toContain('uploads');
    });
  });

  describe('getFileName', () => {
    it('should return formatted filename', () => {
      const file = { originalname: 'my photo.png' } as Express.Multer.File;
      const name = service.getFileName(file);
      expect(name).toMatch(/^\d+\.png$/);
    });
  });

  describe('upload', () => {
    it('should throw NotFoundException if portfolio not found', async () => {
      portfolioRepoMock.findOne = jest.fn().mockResolvedValue(null);

      const file = { filename: 'test.jpg' } as Express.Multer.File;
      const params: UploadImageParams = {
        portfolioId: 'p1',
        dto: { name: 'Test', description: 'desc' },
        userId: 'u1',
      };

      await expect(service.upload(file, params)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      portfolioRepoMock.findOne = jest.fn().mockResolvedValue({ owner: { id: 'other' } });

      const file = { filename: 'test.jpg' } as Express.Multer.File;
      const params: UploadImageParams = {
        portfolioId: 'p1',
        dto: { name: 'Test', description: 'desc' },
        userId: 'u1',
      };

      await expect(service.upload(file, params)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if user not found', async () => {
      portfolioRepoMock.findOne = jest.fn().mockResolvedValue({ owner: { id: 'u1' } });
      userRepoMock.findOne = jest.fn().mockResolvedValue(null);

      const file = { filename: 'test.jpg' } as Express.Multer.File;
      const params: UploadImageParams = {
        portfolioId: 'p1',
        dto: { name: 'Test', description: 'desc' },
        userId: 'u1',
      };

      await expect(service.upload(file, params)).rejects.toThrow(NotFoundException);
    });

    it('should save image successfully', async () => {
      portfolioRepoMock.findOne = jest.fn().mockResolvedValue({ owner: { id: 'u1' } });
      userRepoMock.findOne = jest.fn().mockResolvedValue({ id: 'u1' });
      const file = { filename: 'test.jpg' } as Express.Multer.File;
      const params: UploadImageParams = {
        portfolioId: 'p1',
        dto: { name: 'Test', description: 'desc' },
        userId: 'u1',
      };

      await service.upload(file, params);

      expect(repoMock.create).toHaveBeenCalled();
      expect(repoMock.save).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException if image not found', async () => {
      repoMock.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete('img1', 'u1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if uploader mismatch', async () => {
      repoMock.findOne = jest.fn().mockResolvedValue({ uploader: { id: 'other' }, filePath: 'test.jpg' });

      await expect(service.delete('img1', 'u1')).rejects.toThrow(ForbiddenException);
    });

    it('should delete file and remove image', async () => {
      repoMock.findOne = jest.fn().mockResolvedValue({ uploader: { id: 'u1' }, filePath: 'test.jpg' });
      (unlink as jest.Mock).mockResolvedValue(undefined);

      await service.delete('img1', 'u1');

      expect(unlink).toHaveBeenCalled();
      expect(repoMock.remove).toHaveBeenCalled();
    });

    it('should log error and throw ForbiddenException if file unlink fails', async () => {
      repoMock.findOne = jest.fn().mockResolvedValue({ uploader: { id: 'u1' }, filePath: 'test.jpg' });
      (unlink as jest.Mock).mockRejectedValue(new Error('fail'));

      await expect(service.delete('img1', 'u1')).rejects.toThrow(ForbiddenException);
      expect(loggerMock.error).toHaveBeenCalled();
    });
  });
});