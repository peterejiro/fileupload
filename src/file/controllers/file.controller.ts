import {
  BadRequestException,
  Controller,
  Header,
  HttpStatus,
  Param,
  Post,
  Put,
  RawBodyRequest,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ACLEnum } from '../enum/file.enum';
import { FileService } from '../service/file.service';
import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import { FileBuffer } from '../../fileBuffer';
import { createWriteStream } from 'fs';
import {CustomFileInterceptor} from "../../customFile.intreceptor";

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload-picture')
  @UseInterceptors(FileInterceptor('file', { dest: './upload' }))
  uploadCarPicture(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.add(file, {
      ACL: ACLEnum.PublicRead,
      Path: 'file',
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    console.log(file);
  }

  @Post('picture')
  @Header('content-type', 'image/jpeg')
  Picture(@Req() req: Request) {
    const parsedBody = req.body.toString();
    const buf = Buffer.from(parsedBody, 'base64');
    return this.fileService.fileUpload(buf);
  }

  //@UseInterceptors(CustomFileInterceptor)
  @Put('/upload/:fileName')
  upload(
    @Res() response: Response,
    @Param() fileName: string,
    @FileBuffer() fileBuffer,
  ): any {
    if (fileBuffer === null) throw new BadRequestException('File is required');
    const writeStream = createWriteStream(`./upload/${fileName}`);
    writeStream.write(fileBuffer);

    // return this.fileService.add(writeStream, {
    //   ACL: ACLEnum.PublicRead,
    //   Path: `./upload/${fileName}`,
    // });
    return response.status(HttpStatus.OK).send(`${fileName} uploaded`);
  }
}
