import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
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
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // to use @Exclude() in entities
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

//TODO: add Logger
//TODO: trotling

//TODO: google for secure api

//TODO: check how ro impove code, doc, response

//TODO: check if need

//TODO: Add /api/portfolios/create? /api/portfolios/delete?
//TODO: розобратся с { id: 'cee6563a-6fb3-4e90-bdc7-5c8f17e97b3c', username: undefined }
//TODO: доробити свагер
//TODO: check all response ts contollers and services and other help functions conf, filter, fecorators
//TODO: improve swager documentation, check status codes and messages
//TODO: check min max values for fields strings if empty and others
//TODO: ADD seed fake data
//TODO: add test
//TODO: check index DB

//TODO: check new FileTypeValidator({ fileType: /(jpe?g|png)$/i }), need fix it
//TODO: image DTO fix
////TODO:Rate limiter
////TODO:check documentation secure topics

//TODO: Use logical nesting on endpoints: https://stackoverflow.blog/2020/03/02/best-practices-for-rest-api-design/#h2-8ec448c6df8c0

//TODO: check if the code is okay chatgpt
////TODO: import { Image } from 'src/images/entities/image.entity';
////TODO: import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
////TODO: import { User } from 'src/users/entities/user.entity';
////TODO: imports: [TypeOrmModule.forFeature([Image, Portfolio, User])],
////TODO: new FileTypeValidator({ fileType: /(jpe?g|png)$/i }), need fix it