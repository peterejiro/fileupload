import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { envConfigValidator } from './config/config.validator';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { UploadMiddleware } from './upload.middleware';

@Module({
  controllers: [],
  imports: [
    FileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envConfigValidator,
    }),
  ],

  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UploadMiddleware).forRoutes({
      path: 'file/upload/:fileName',
      method: RequestMethod.POST,
    });
    //consumer.apply(JsonBodyMiddleware).forRoutes('/');
    // consumer.apply(RawBodyMiddleware).forRoutes('/');
  }
}
