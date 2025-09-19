import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		// Handle HTTP exceptions
		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const resBody = exception.getResponse();
			response.status(status).json({
				statusCode: status,
				timestamp: new Date().toISOString(),
				path: request.url,
				...(typeof resBody === 'object' ? resBody : { message: resBody }),
			});
			return;
		}

		// Fallback - 500
		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			statusCode: 500,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: 'Internal server error',
		});
	}
}
