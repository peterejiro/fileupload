import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler) {
    // changing request
    const request = _context.switchToHttp().getRequest();

    request['fileBuffer'] = request.image;

    return next.handle().pipe(
      map((flow) => {
        flow.name = 'changing response body';
        return flow;
      }),
    );
  }
}
