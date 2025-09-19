import { registerAs } from '@nestjs/config';

export const ServerConfigName = 'server';

export interface ServerConfig {
	appEnv: string;
	port: number;
}

//TODO: add logDirectory: process.env.LOG_DIR,
export default registerAs(ServerConfigName, () => ({
	appEnv: process.env.APP_ENV,
	port: parseInt(process.env.PORT || '3000'),
}));
