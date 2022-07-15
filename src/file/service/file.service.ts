import { ACLEnum, FileTypeEnum } from '../enum/file.enum';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Express } from 'express';
import { InjectAwsService } from 'nest-aws-sdk';
import { S3 } from 'aws-sdk';
import * as fs from 'fs';
import {
  FileUploadDto,
  InitializeFileForS3DtoResponse,
} from '../dtos/file.dto';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from 'src/config/env.enum';
import * as sharp from 'sharp';
import * as multer from 'multer';

/** file storage settings */
export const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync('./upload'))
      fs.mkdirSync('./upload', {
        mode: '0777',
      });
    cb(null, './upload');
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split('.')[1];
    cb(null, `${new Date().getTime()}.${extension}`);
  },
});

@Injectable()
export class FileService {
  private readonly bucket: string;
  private readonly s3Prefix: string;

  constructor(
    @InjectAwsService(S3) private s3: S3,
    private readonly configService: ConfigService,
  ) {
    this.bucket = this.configService.get<string>(EnvConfigEnum.APP_AWS_BUCKET);
    this.s3Prefix = 'https://s3.amazonaws.com';
  }

  async resizeImage(
    path: string,
    width: number,
    height: number,
    quality: number,
    format: 'webp' | 'jpg' | 'png' | 'gif',
  ) {
    /**
    1. check the resolution of the image 
    2. 
     */
    try {
      const name = path.split('.')[0];
      const localPath = `${name}-${width}x${height}.${format}`;
      /** */
      const processing = sharp(path, { failOnError: true }).resize(
        width,
        height,
        {
          fit: 'contain',
        },
      );
      /** determine the format  */
      switch (format) {
        case 'webp':
          processing.webp({ quality });
          break;
        case 'png':
          processing.png({ quality });
          break;
        case 'jpg':
          processing.jpeg({ quality });
          break;
        case 'gif':
          processing.jpeg({ quality });
          break;
        default:
          processing.jpeg({ quality });
      }

      await processing.toFile(localPath);
      return localPath;
    } catch (e) {
      Logger.log(e.message);
      throw new BadRequestException('error resizing image');
    }
  }

  getBucket() {
    return this.bucket;
  }
  getS3Prefix() {
    return this.s3Prefix;
  }

  getFileType(file: Express.Multer.File) {
    const mimeType = file.mimetype.split('/')[0];
    const imageFileTypes = ['image'];
    const documentFileType = ['application', 'text'];
    const videoFileType = ['video'];
    const audioFileType = ['audio'];
    //
    if (imageFileTypes.includes(mimeType)) {
      return FileTypeEnum.Image;
    } else if (documentFileType.includes(mimeType)) {
      return FileTypeEnum.Document;
    } else if (videoFileType.includes(mimeType)) {
      return FileTypeEnum.Video;
    } else if (audioFileType.includes(mimeType)) {
      return FileTypeEnum.Audio;
    }
  }

  /** this does not upload the file, it only gives you the path to the file when it is uploaded */
  initializeFileForS3(
    content: string,
    bucket: string,
    key: string /** the path where the fille will be stored */,
    name: string,
  ): InitializeFileForS3DtoResponse {
    const s3Path = `${this.s3Prefix}/${bucket}/${key}/${name}`;
    const itemKey = `${key}/${name}`;
    return { s3Path, key: itemKey };
  }

  async fileUpload(file) {
    return await this.s3
      .upload({
        Bucket: this.bucket,
        ACL: ACLEnum.Private,
        Key: '8900',
        Body: fs.createReadStream(file),
      })
      .promise();
  }

  async uploadPublicFile(buffer: Buffer, key: string) {
    const data = {
      Key: key,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
      Bucket: this.bucket,
    };
    this.s3.putObject(data, function (err, data) {
      if (err) {
        console.log(err);
        console.log('Error uploading data: ', data);
      } else {
        console.log(data);
      }
    });
  }

  async add(file, data: FileUploadDto) {
    const { ACL, Path } = data;

    const filePath = `${Path}/${file.originalname}`;

    //await this.resizeImage(filePath, 300, 300, 100, 'jpg');

    const result = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: filePath,
        Body: fs.createReadStream(file.path),
      })
      .promise();

    this.deleteFile(file.path);

    return result;
  }

  deleteFile(file: string) {
    return fs.unlinkSync(file);
  }
}
