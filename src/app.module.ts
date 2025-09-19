import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import serverConfig from './configs/server.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './image/image.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [serverConfig],
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('DB_HOST'),
				port: parseInt(configService.get('DB_PORT') || '5432'),
				username: configService.get('DB_USER'),
				password: configService.get('DB_PASS'),
				database: configService.get('DB_NAME'),
				entities: [__dirname + '/**/*.entity{.ts,.js}'],
				autoLoadEntities: true,
				synchronize: configService.get('APP_ENV') !== 'production',
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UsersModule,
		ImagesModule,
		// PortfolioModule,
		// CommentModule,
	],
	providers: [AppService],
	controllers: [AppController],
})
export class AppModule {}
