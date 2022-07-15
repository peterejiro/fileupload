import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FileBuffer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['fileBuffer'] || null;
  },
);
