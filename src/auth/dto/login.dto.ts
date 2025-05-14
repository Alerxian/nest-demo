import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

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
