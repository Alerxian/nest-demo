import { User } from '@/users/entities/user.entity';
import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const { username, password } = loginDto;
      // 查询用户是否存在
      const user = await this.userRepository.findOne({
        where: { username },
      });
      if (!user) {
        throw new UnauthorizedException({
          message: '用户或密码不正确',
          code: HttpStatus.UNAUTHORIZED,
        });
      }
      Logger.log(user.password, 'password');
      Logger.log(bcrypt.compare(password, user.password), 'compareSync');
      // 对比密码是否正确
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new UnauthorizedException({
          message: '用户或密码不正确',
          code: HttpStatus.UNAUTHORIZED,
        });
      }

      return {
        code: HttpStatus.OK,
        data: user,
        message: '登录成功',
      };
    } catch (error) {
      Logger.error('登录失败', error);
      throw error;
    }
  }
}
