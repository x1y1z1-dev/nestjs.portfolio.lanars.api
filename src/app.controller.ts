import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	@ApiResponse({
		status: 302,
		description: 'Redirect to API documentation',
	})
	getHello(@Res() res): {
		redirect(url: string): Response;
	} {
		return res.redirect(this.appService.redirectToDocs());
	}
}
