import {
	Controller,
	Post,
	Param,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	Body,
	Request,
	Delete,
	Get,
	Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ImagesService } from './image.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { extname } from 'path';

@Controller('portfolios')
export class ImagesController {
	constructor(private service: ImagesService) {}

	@UseGuards(JwtAuthGuard)
	@Post(':id/images')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: process.env.UPLOAD_DIR || './uploads',
				filename: (req, file, cb) => {
					const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
					cb(null, unique);
				},
			}),
			limits: { fileSize: 5 * 1024 * 1024 },
			fileFilter: (req, file, cb) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) return cb(new Error('Only images allowed'), false);
				cb(null, true);
			},
		}),
	)
	async uploadImage(
		@Param('id') id: string,
		@UploadedFile() file: Express.Multer.File,
		@Body() dto: UploadImageDto,
		@Request() req,
	) {
		const res = await this.service.upload(id, file.filename, dto, req.user.userId);
		return res;
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/images/:id')
	async deleteImage(@Param('id') id: string, @Request() req) {
		await this.service.delete(id, req.user.userId);
		return { message: 'Deleted' };
	}

	@Get('/images/feed')
	async feed(@Query('page') page = '1', @Query('limit') limit = '20') {
		const p = parseInt(page, 10) || 1;
		const l = parseInt(limit, 10) || 20;
		return this.service.feed(p, l);
	}
}
