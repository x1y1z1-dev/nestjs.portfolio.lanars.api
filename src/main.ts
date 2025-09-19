import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ServerConfig, ServerConfigName } from './configs/server.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		// logger: console,
	});

	const configService = app.get(ConfigService);
	const serverConfig = configService.getOrThrow<ServerConfig>(ServerConfigName);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
	app.useGlobalFilters(new AllExceptionsFilter());
	app.setGlobalPrefix('api');
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Portfolio publication API')
		.setDescription('My portfolio API description')
		.setVersion('1.0')
		.addTag('Portfolio API')
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, documentFactory);

	await app.listen(serverConfig.port, () => {
		console.log(`REST API: http://localhost:${serverConfig.port}/api`);
		console.log(`Swagger Doc: http://localhost:${serverConfig.port}/doc`);
	});
}

bootstrap();
