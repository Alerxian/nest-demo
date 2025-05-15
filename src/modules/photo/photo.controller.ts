import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/common/utils/file.util';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      // fileFilter(req, file, callback) {
      //   // 检查文件类型
      //   const mimeType = file.originalname;
      //   console.log('mimeType', mimeType);
      //   file.mimetype = mimeType || 'application/octet-stream';

      //   // 只允许图片
      //   if (!file.mimetype.startsWith('image/')) {
      //     return callback(new Error('只允许上传图片文件'), false);
      //   }
      //   callback(null, true);
      // },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPhotoDto: CreatePhotoDto,
  ) {
    return this.photoService.create({ ...createPhotoDto, file });
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photoService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photoService.remove(id);
  }
}
