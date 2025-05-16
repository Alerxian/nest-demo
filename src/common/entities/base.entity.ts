import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity<T = number> {
  @ApiProperty({
    description: 'id',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: T;

  @ApiProperty({
    description: '创建时间',
    example: '2025-05-15T10:00:00Z',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    comment: '创建时间',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2025-05-15T10:00:00Z',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: '更新时间',
  })
  updatedAt: Date;
}
