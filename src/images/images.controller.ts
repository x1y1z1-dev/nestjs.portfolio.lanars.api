import {
	Controller,
	Post,
	Param,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	Body,
	Delete,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ImagesService } from './images.service';
import type { UserRequest } from '../common/types/general.type';
import { GetUser } from '../common/decorators/get-user.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';

@Controller('images')
export class ImagesController {
	constructor(private imagesService: ImagesService) { }

	@ApiConsumes('multipart/form-data')
	@UseGuards(JwtAuthGuard)
	@Post('upload/:portfolioId')
	@ApiBearerAuth()
	@ApiBody({
		description: 'Upload an image file (jpg, jpeg, png) max 5MB',
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Image name', maxLength: 100 },
				description: { type: 'string', description: 'Description' },
				image: { type: 'string', format: 'binary', description: 'JPEG or PNG image file' },
			},
			required: ['image', 'name'],
		},
	})
	@ApiResponse({ status: 201, description: 'The file has been successfully uploaded.' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@ApiResponse({ status: 403, description: 'Not allowed to upload to this portfolio' })
	@ApiResponse({ status: 404, description: 'No file uploaded' })
	@UseInterceptors(FileInterceptor('image'))
	async uploadImage(
		@Param('portfolioId') portfolioId: string,
		@UploadedFile() file: Express.Multer.File,
		@Body('name') name: string,
		@Body('description') description: string,
		@GetUser() user: UserRequest,
	): Promise<{ message: string; filePath?: string }> {
		if (!file) throw new BadRequestException('No file uploaded');

		await this.imagesService.upload(file, {
			portfolioId,
			name,
			description,
			userId: user.id,
		});

		return {
			message: 'The file has been successfully uploaded.',
			filePath: file.filename,
		};
	}

	@UseGuards(JwtAuthGuard)
	@Delete('delete/:imageId')
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Deleted' })
	@ApiResponse({ status: 403, description: 'Not allowed' })
	@ApiResponse({ status: 404, description: 'Image not found' })
	async deleteImage(@Param('imageId') imageId: string, @GetUser() user: UserRequest): Promise<{ message: string }> {
		await this.imagesService.delete(imageId, user.id);

		return {
			message: 'Image deleted',
		};
	}
}
