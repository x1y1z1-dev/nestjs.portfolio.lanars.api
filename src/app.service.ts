import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
	constructor(private configService: ConfigService) { }
	redirectToDocs(): string {
		const port = this.configService.get<number>('PORT') ?? 3000;
		return `http://localhost:${port}/doc`;
	}
}
