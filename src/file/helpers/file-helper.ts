import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    req.fileValidationError = 'Only Image Files Allowed';
    return callback(null, false);
  }
  callback(null, true);
};
export const DocumentUpload = () => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './upload/verificationDocuments',
          filename: (req, file, cb) => {
            const extension = extname(file.originalname);
            cb(null, `${Date.now()}${extension}`);
          },
        }),
      }),
    ),
  );
};
