import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // 全局参数校验
  app.useGlobalPipes(new ValidationPipe());

  // 请求返回response字段过滤
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 设置静态文件服务
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 设置session
  app.use(
    session({
      secret: configService.get('session.secret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: configService.get('session.maxAge'),
        httpOnly: true,
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
