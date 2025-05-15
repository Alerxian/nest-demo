import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}
  async create({
    file,
    description,
  }: {
    file: Express.Multer.File;
    description?: string;
  }) {
    if (!file) {
      return new Error('文件不能为空');
    }
    Logger.log('file', file);
    Logger.log('description', description);

    // 保存文件
    const photo = this.photoRepository.create({
      filename: file.filename,
      mimetype: file.mimetype,
      url: `/uploads/${file.filename}`,
      description,
      originalname: file.originalname,
    });

    // 保存数据库
    await this.photoRepository.save(photo);

    return {
      data: photo,
      message: '上传成功',
    };
  }

  async findAll() {
    const [photos, total] = await this.photoRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: photos,
      total: total,
      message: 'success',
    };
  }

  async findOne(id: string) {
    const photo = await this.photoRepository.findOne({
      where: {
        id,
      },
    });
    if (!photo) {
      return new NotFoundException('图片不存在');
    }

    return {
      data: photo,
      message: 'success',
    };
  }

  // update(id: number, updatePhotoDto: UpdatePhotoDto) {

  // }

  async remove(id: string) {
    const photo = await this.photoRepository.findOne({
      where: {
        id,
      },
    });
    if (!photo) {
      return new NotFoundException('图片不存在');
    }
    await this.photoRepository.remove(photo);
    return {
      message: 'success',
    };
  }
}
