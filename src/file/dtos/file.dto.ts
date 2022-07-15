import { FileTypeEnum, ACLEnum } from '../enum/file.enum';

export class InitializeFileForS3DtoResponse {
  s3Path: string;
  key: string;
}

export class FileUploadDto {
  Path: string;
  ACL: ACLEnum;
}
