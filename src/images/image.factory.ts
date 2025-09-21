import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Injectable()
export class ImageDiskFactory implements MulterOptionsFactory {
  constructor(private readonly imagesService: ImagesService) { }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: this.imagesService.getDiskPath(),
        filename: (_, file, callback) => {
          const fileName = this.imagesService.getFileName(file);
          callback(null, fileName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type'), false);
        }
      },
    };
  }
}
