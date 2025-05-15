import { IsOptional, IsString } from 'class-validator';

export class CreatePhotoDto {
  @IsString()
  @IsOptional()
  description?: string;

  // @IsString()
  // @IsNotEmpty({ message: '文件名不能为空' })
  // filename: string;

  // @IsString()
  // @IsNotEmpty({ message: '文件类型不能为空' })
  // mimetype: string;
}
