import {
  ConflictException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    /**
     * 检查用户名是否存在
     * 加密密码
     */
    const existingUser = await this.userRepository.findOne({
      where: [
        {
          username: createUserDto.username,
        },
        {
          email: createUserDto.email,
        },
      ],
    });
    if (existingUser) {
      throw new ConflictException('用户名或邮箱已存在');
    }

    // 加密密码
    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    return this.userRepository.save(createUserDto);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // 模糊搜索
    if (search) {
      queryBuilder.where(
        'user.username LIKE :search OR user.email LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }
    const [users, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .andWhere('user.isActive = :isActive', { isActive: true })
      .getManyAndCount();

    return {
      item: users,
      total,
      page: Number(page),
      limit: Number(limit),
      hasNext: total > page * limit,
      hasPrevious: page > 1,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const findUser = await this.userRepository.findOne({
      where: {
        id,
        isActive: true,
      },
    });
    if (!findUser) {
      throw new HttpException('用户不存在', 200);
    }
    return findUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 检查用户是否存在
    await this.findOne(id);

    try {
      if (updateUserDto.password) {
        const hashedPassword = bcrypt.hashSync(updateUserDto.password, 10);
        updateUserDto.password = hashedPassword;
      }

      // 检查邮箱是否占用
      if (updateUserDto.email) {
        const existingUser = await this.userRepository.findOne({
          where: {
            email: updateUserDto.email,
            id: Not(id),
          },
        });
        if (existingUser) {
          throw new ConflictException('邮箱已被占用');
        }
      }

      await this.userRepository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });
      return this.findOne(id);
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      } else {
        throw new HttpException('更新用户信息失败', 500);
      }
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    try {
      await this.userRepository.update(id, {
        isActive: false,
        updatedAt: new Date(),
      });
      return {
        message: '删除成功！',
      };
    } catch (err) {
      Logger.error(err);
      throw new HttpException('删除用户失败', 500);
    }
  }
}
