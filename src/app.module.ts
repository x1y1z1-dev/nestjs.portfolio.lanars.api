import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { ImagesModule } from './images/images.module';
import diskConfig from './configs/disk.config';
import serverConfig from './configs/server.config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CommentsModule } from './comments/comments.module';
import { typeOrmConfig } from './configs/typeorm.config';
import { LoggerModule } from './common/logger/logger.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [serverConfig, diskConfig],
		}),
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => [
				{
					ttl: config.get('THROTTLE_TTL'),
					limit: config.get('THROTTLE_LIMIT'),
				},
			],
		}),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/client',
		}),
		LoggerModule,
		AuthModule,
		UsersModule,
		PortfoliosModule,
		ImagesModule,
		CommentsModule,
	],
	providers: [AppService],
	controllers: [AppController],
})
export class AppModule { }
