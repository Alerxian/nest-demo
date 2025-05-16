import { User } from '@/modules/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  // @IsString()
  // @IsNotEmpty({ message: '邮箱不能为空' })
  // @IsEmail({}, { message: '邮箱格式不正确' })
  // email: string;

  // isActive?: boolean;
  // createdAt?: Date;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
      },
    },
  })
  data: {
    token: string;
    user: User;
  };

  @ApiProperty({ example: '登录成功' })
  message: string;
}
