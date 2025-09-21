import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ServerConfig, ServerConfigName } from './configs/server.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { AppLogger } from './common/logger/logger.service';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { logger: false });
	const logger = app.get(AppLogger);

	const configService = app.get(ConfigService);
	const serverConfig = configService.getOrThrow<ServerConfig>(ServerConfigName);

	app.useLogger(logger);
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // to use @Exclude() in entities
	app.useGlobalFilters(new AllExceptionsFilter());
	app.setGlobalPrefix('api');
	app.enableCors();
	app.use(helmet());

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
