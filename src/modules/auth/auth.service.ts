import { User } from '@/modules/users/entities/user.entity';
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
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
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
      // 对比密码是否正确
      const isValid = await bcrypt.compare(password, user.password);
      Logger.debug(`Stored password hash: ${user.password}`);
      Logger.debug(`Input password: ${password}`);

      // 进行密码验证
      Logger.debug(`Password comparison result: ${isValid}`);
      if (!isValid) {
        throw new UnauthorizedException({
          message: '用户或密码不正确',
          code: HttpStatus.UNAUTHORIZED,
        });
      }

      return user;
    } catch (error) {
      Logger.error('登录失败', error);
      throw error;
    }
  }

  async generateToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.username,
    };

    try {
      const token = await this.jwtService.signAsync(payload);
      return token;
    } catch (err) {
      Logger.error('生成token失败', err);
      throw err;
    }
  }

  async getProfile(userId: number) {
    return this.userService.findOne(userId);
  }
}
