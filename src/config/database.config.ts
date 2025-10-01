import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { entities } from '../database/entities';
import { EnvUtils } from '../common/utils/env.utils';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: EnvUtils.getEnvVariable<string>('DB_HOST'),
  port: EnvUtils.getEnvVariable<number>('DB_PORT', {
    defaultValue: 3306,
    type: 'number',
  }),
  database: EnvUtils.getEnvVariable<string>('DB_DATABASE'),
  username: EnvUtils.getEnvVariable<string>('DB_USER'),
  password: EnvUtils.getEnvVariable<string>('DB_PASSWORD'),
  entities,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: false,
  connectTimeout: EnvUtils.getEnvVariable<number>('DB_CONNECTION_TIMEOUT', {
    defaultValue: 5000,
    type: 'number',
  }),
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: false,
  supportBigNumbers: true,
  bigNumberStrings: false,
};

// Nest-specific config
export const typeormModuleOptions: TypeOrmModuleOptions = {
  ...dataSourceOptions,
};

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => typeormModuleOptions,
);
