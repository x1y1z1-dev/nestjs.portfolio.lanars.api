import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import type { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Injectable()
export class ImageDiskFactory implements MulterOptionsFactory {
  constructor(readonly imagesService: ImagesService) { }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: this.imagesService.getDiskPath(),
        filename: (_, file, callback) => {
          const fileName = this.imagesService.getFileName(file);
          callback(null, fileName);
        },
      }),
    };
  }
}
