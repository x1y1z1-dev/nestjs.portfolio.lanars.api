import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosController } from './portfolios.controller';
import { User } from '../users/entities/user.entity';
import { Comment } from '../comments/entities/comment.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Portfolio, User, Comment])],
	providers: [PortfoliosService],
	controllers: [PortfoliosController],
	exports: [PortfoliosService],
})
export class PortfoliosModule { }
