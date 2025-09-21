import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [serverConfig, diskConfig],
		}),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/client',
		}),
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
