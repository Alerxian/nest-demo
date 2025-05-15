import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo extends BaseEntity<string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '文件URL路径',
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '文件描述',
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '文件名',
  })
  filename: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '原始文件名',
  })
  originalname: string;

  @Column({
    type: 'varchar',
    length: 50,
    comment: '文件类型',
  })
  mimetype: string;
}
