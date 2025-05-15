import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as IoRedis from 'ioredis';

interface ITokenPayload {
  sub: number; // id
  username: string;
}

@Injectable()
export class JwtAuthService {
  private readonly redis: IoRedis.Redis;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.redis = this.redisService.getOrThrow();
  }

  // 生成access_token
  async generateAccessToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.access.secret'),
      expiresIn: this.configService.get('jwt.access.expiresIn'),
    });
  }

  // 生成refresh_token
  async generateRefreshToken(payload: ITokenPayload) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refresh.secret'),
      expiresIn: this.configService.get('jwt.refresh.expiresIn'),
    });

    // 将refreshToken存入redis， 设置过期时间
    await this.redis.set(
      `refresh_token:${payload.sub}`,
      refreshToken,
      'EX',
      this.configService.get('jwt.refresh.expiresInSeconds'),
    );

    return refreshToken;
  }

  async verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: this.configService.get('jwt.access.secret'),
    });
  }

  async verifyRefreshToken(token: string) {
    const payload = this.jwtService.verify<ITokenPayload>(token, {
      secret: this.configService.get('jwt.refresh.secret'),
    });

    // 检查redis中是否存在payload
    const storedToken = await this.redis.get(`refresh_token:${payload.sub}`);
    if (storedToken !== token) {
      throw new Error('不合法的refreshToken');
    }

    return payload;
  }

  // 踢下线
  async revokeRefreshToken(id: number) {
    await this.redis.del(`refresh_token:${id}`);
  }

  // 刷新token
  async refreshTokens(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    await this.revokeRefreshToken(payload.sub); // 旧的token删除

    // 生成新的
    const newPayload = { ...payload };
    const accessToken = await this.generateAccessToken(newPayload);
    const newRefreshToken = this.generateRefreshToken(newPayload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
