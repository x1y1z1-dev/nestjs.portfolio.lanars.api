import { Test, TestingModule } from '@nestjs/testing';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UploadImageDto } from './dto/upload-image.dto';

describe('ImagesController', () => {
  let controller: ImagesController;
  let service: ImagesService;

  const mockImagesService = {
    upload: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = { id: 'user-id', email: 'test@example.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        { provide: ImagesService, useValue: mockImagesService },
      ],
    }).compile();

    controller = module.get<ImagesController>(ImagesController);
    service = module.get<ImagesService>(ImagesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should throw BadRequestException if no file', async () => {
      const dto: UploadImageDto = { name: 'Test', description: 'Test description' };

      await expect(
        controller.uploadImage('portfolio-id', undefined as any, dto, mockUser as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should call ImagesService.upload and return message and filePath', async () => {
      const file = { filename: 'test.jpg' } as Express.Multer.File;
      const dto: UploadImageDto = { name: 'Test', description: 'Test description' };

      mockImagesService.upload.mockResolvedValueOnce(undefined);

      const result = await controller.uploadImage('portfolio-id', file, dto, mockUser as any);

      expect(mockImagesService.upload).toHaveBeenCalledWith(file, {
        portfolioId: 'portfolio-id',
        dto,
        userId: mockUser.id,
      });

      expect(result).toEqual({
        message: 'The file has been successfully uploaded.',
        filePath: file.filename,
      });
    });
  });

  describe('deleteImage', () => {
    it('should call ImagesService.delete and return message', async () => {
      mockImagesService.delete.mockResolvedValueOnce(undefined);

      const result = await controller.deleteImage('image-id', mockUser as any);

      expect(mockImagesService.delete).toHaveBeenCalledWith('image-id', mockUser.id);
      expect(result).toEqual({ message: 'Image deleted' });
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      mockImagesService.delete.mockRejectedValueOnce(new NotFoundException());

      await expect(controller.deleteImage('image-id', mockUser as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if service throws ForbiddenException', async () => {
      mockImagesService.delete.mockRejectedValueOnce(new ForbiddenException());

      await expect(controller.deleteImage('image-id', mockUser as any)).rejects.toThrow(ForbiddenException);
    });
  });
});
