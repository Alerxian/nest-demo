import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity<T = number> {
  @PrimaryGeneratedColumn()
  id: T;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    comment: '更新时间',
  })
  updatedAt: Date;
}
