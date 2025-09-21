import { registerAs } from '@nestjs/config';

export const ServerConfigName = 'server';

export interface ServerConfig {
	appEnv: string;
	port: number;
}

export default registerAs(ServerConfigName, () => ({
	appEnv: process.env.APP_ENV,
	port: parseInt(process.env.PORT || '3000'),
	logsPath: process.env.LOG_DIR,
}));
