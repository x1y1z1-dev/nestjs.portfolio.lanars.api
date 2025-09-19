import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfoliosService } from './portfolio.service';
import { PortfoliosController } from './portfolio.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Portfolio, User])],
	providers: [PortfoliosService],
	controllers: [PortfoliosController],
	exports: [PortfoliosService],
})
export class PortfoliosModule {}
