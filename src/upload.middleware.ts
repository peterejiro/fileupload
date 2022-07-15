import { Injectable, NestMiddleware, RawBodyRequest } from '@nestjs/common';
import { raw, Request, Response } from 'express';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    raw({
      verify: (req: RawBodyRequest<Request>, res: Response, buffer: Buffer) => {
        req['fileBuffer'] = buffer;
      },
      limit: '50mb',
      type: 'image/jpeg',
    })(req, res as any, next);
  }
}
