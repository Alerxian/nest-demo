import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PhotoModule } from './modules/photo/photo.module';
import { createDataSourceOptions } from './config/data-source';
import { HealthController } from './common/controllers/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { GlobalModule } from './common/module/global.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.development`, '.env'],
      load: [
        () => {
          // 添加调试信息
          Logger.debug(`加载环境配置:`, 'ConfigModule');
          Logger.debug(`NODE_ENV: ${process.env.NODE_ENV}`, 'ConfigModule');
          Logger.debug(
            `配置文件: .env.${process.env.NODE_ENV}`,
            'ConfigModule',
          );
          return {};
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        createDataSourceOptions(configService),
      inject: [ConfigService],
    }),
    UsersModule,
    PhotoModule,
    AuthModule,
    GlobalModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
