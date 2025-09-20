import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequest } from '../types/general.type';

export const GetUser = createParamDecorator(
	(data: keyof UserRequest | undefined, ctx: ExecutionContext): UserRequest | string | undefined => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user as UserRequest;

		return data ? user?.[data] : user;
	},
);
