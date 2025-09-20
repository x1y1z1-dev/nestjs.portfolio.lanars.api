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
	ParseFilePipe,
	MaxFileSizeValidator,
	FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';
import type { UserRequest } from 'src/common/types/general.type';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('images')
export class ImagesController {
	constructor(
		private configService: ConfigService,
		private service: ImagesService,
	) { }

	@ApiConsumes('multipart/form-data')
	// @UseGuards(JwtAuthGuard)
	@Post(':id')
	@ApiBody({
		description: 'Upload an image file (jpg, jpeg, png) max 5MB',
		type: 'multipart/form-data',
	})
	@UseInterceptors(FileInterceptor('image'))
	async uploadImage(
		@Param('id') id: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // макс 5MB
					new FileTypeValidator({ fileType: /image\/jpeg/i }),
				],
			}),
		)
		file: Express.Multer.File,
		// @Body() dto: UploadImageDto,
		// @GetUser() user: UserRequest,
	) {
		console.log(id);
		console.log(file);
		// console.log(dto);
		// console.log(user);
		// 	const res = await this.service.upload(id, file.filename, dto, user.id);
		// 	return res;
	}

	// @UseGuards(JwtAuthGuard)
	// @Delete('/images/:id')
	// async deleteImage(@Param('id') id: string, @GetUser() user: UserRequest,) {
	// 	await this.service.delete(id, req.user.userId);
	// 	return { message: 'Deleted' };
	// }

	// @Get('/images/feed')
	// async feed(@Query('page') page = '1', @Query('limit') limit = '20') {
	// 	const p = parseInt(page, 10) || 1;
	// 	const l = parseInt(limit, 10) || 20;
	// 	return this.service.feed(p, l);
	// }
}

