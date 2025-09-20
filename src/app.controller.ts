import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get()
	@ApiResponse({
		status: 302,
		description: 'Redirect to API documentation',
	})
	getHello(@Res() res: Response): void {
		res.redirect(this.appService.redirectToDocs());
	}
}
