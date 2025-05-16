import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'node:path';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './common/intercepts/transfrom.Interceptor';
import { HttpExceptionFilter } from './common/filters/http-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  // 全局参数校验
  app.useGlobalPipes(new ValidationPipe());

  // 注册全局响应拦截
  // 请求返回response字段过滤
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor(),
  );

  // 异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

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

  // swagger文档
  const swaggerConfig = new DocumentBuilder()
    .setTitle('api文档')
    .setVersion('1.0')
    .addTag('api')
    .setDescription('nest-demo swagger文档')
    .addBasicAuth() // jwt认证
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [],
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api', app, document);
  // 添加全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
