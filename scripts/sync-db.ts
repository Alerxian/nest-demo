import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { User } from '../src/modules/users/entities/user.entity';
import { Client } from 'pg';
import { config } from 'dotenv';
import * as path from 'path';
import dataSource from '../src/config/data-source';
import * as bcrypt from 'bcrypt';

const logger = new Logger('DatabaseSync');

async function createDatabaseIfNotExists() {
  // 加载环境配置
  const env = process.env.NODE_ENV || 'development';
  config({ path: path.resolve(process.cwd(), `.env.${env}`) });
  // console.log(process.env.DB_USERNAME, process.env);
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();
    const dbName = process.env.DB_DATABASE || 'nest_demo';

    // 检查数据库是否存在
    const result = await client.query(
      `SELECT datname FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (result.rows.length === 0) {
      logger.log(`创建数据库 ${dbName}...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      logger.log('数据库创建成功');
    } else {
      logger.log(`数据库 ${dbName} 已存在`);
    }
  } catch (error) {
    logger.error('创建数据库失败:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

export async function initializeSchema(ds: DataSource) {
  try {
    // 检查是否需要初始化架构
    const tableExists = await ds.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user'
      );
    `);

    if (!tableExists[0].exists) {
      logger.log('首次初始化数据库架构...');
      await ds.synchronize(false); // false 表示不删除现有的表
      logger.log('数据库架构初始化完成');
    } else {
      logger.log('数据库架构已存在，跳过初始化');
    }
  } catch (error) {
    logger.error('架构初始化失败:', error.message);
    throw error;
  }
}

async function createAdminUser(ds: DataSource) {
  try {
    const userRepository = ds.getRepository(User);

    const adminExists = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const pwd = await bcrypt.hash('admin123', 10);
      const admin = userRepository.create({
        username: 'admin',
        password: pwd,
        email: 'admin@example.com',
        isActive: true,
      });
      await userRepository.save(admin);
      logger.log('管理员账号创建成功');
    } else {
      logger.log('管理员账号已存在');
    }
  } catch (error) {
    logger.error('创建管理员账号失败:', error.message);
    throw error;
  }
}

async function syncDatabase() {
  try {
    // 1. 确保数据库存在
    await createDatabaseIfNotExists();

    // 2. 初始化数据源连接
    logger.log('初始化数据源连接...');
    const ds = await dataSource.initialize();

    // 3. 同步数据库架构
    await initializeSchema(ds);

    // 4. 创建管理员账号
    await createAdminUser(ds);

    logger.log('数据库同步完成');
    process.exit(0);
  } catch (error) {
    logger.error('数据库同步失败:', error.message);
    process.exit(1);
  } finally {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
      logger.log('数据库连接已关闭');
    }
  }
}

// 添加错误处理
process.on('unhandledRejection', (error: Error) => {
  logger.error('未处理的异常:', error.message);
  process.exit(1);
});

syncDatabase();
