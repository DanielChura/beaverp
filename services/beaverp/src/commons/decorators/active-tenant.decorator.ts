import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ActiveTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req['user'].tenantId;
  },
);
