import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PhotoModule } from './modules/photo/photo.module';
import { createDataSourceOptions } from './config/data-source';
import { HealthController } from './common/controllers/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from './common/module/global.module';
import configuration from './config/configuration';
import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      load: [
        () => {
          // 添加调试信息
          Logger.debug(`加载环境配置:`, 'ConfigModule');
          Logger.debug(`NODE_ENV: ${process.env.NODE_ENV}`, 'ConfigModule');
          Logger.debug(`配置文件: .env.${process.env.DB_NAME}`, 'ConfigModule');
          return {};
        },
        configuration,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDataSourceOptions(configService),
      inject: [ConfigService],
    }),
    NestRedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),
    UsersModule,
    PhotoModule,
    AuthModule,
    GlobalModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
