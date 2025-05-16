import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: '用户名',
    example: 'admin',
    maxLength: 50,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  username: string;

  @ApiHideProperty() // 隐藏密码字段，不在 Swagger 文档中显示
  @Exclude()
  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @ApiProperty({
    description: '邮箱地址',
    example: 'admin@example.com',
    maxLength: 50,
  })
  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @ApiProperty({
    description: '是否启用',
    example: true,
    default: true,
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
}
