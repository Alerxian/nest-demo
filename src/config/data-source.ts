import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'node:path';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

export const createDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => {
  const nodeEnv = configService.get('NODE_ENV');

  // 基础配置
  const baseConfig: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '/../migrations/*{.ts,.js}')],
    synchronize: nodeEnv !== 'production',
    logging: true,
  };

  // 生产环境配置
  const prodConfig: Partial<DataSourceOptions> = {
    logging: false,
    synchronize: false,
    ssl:
      configService.get('DB_SSL') === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    extra: {
      max: 20,
      connectionTimeoutMillis: 10000,
    },
  };

  const config =
    nodeEnv === 'production' ? { ...baseConfig, ...prodConfig } : baseConfig;

  return config as DataSourceOptions;
};

// 加载环境变量
config({ path: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'] });
const configService = new ConfigService();

// 添加默认导出的 DataSource 实例
const dataSource = new DataSource(createDataSourceOptions(configService));
export default dataSource;
