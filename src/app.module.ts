import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigNotInitializedException } from './common/exceptions/config-not-initialized.exception';
import databaseConfig from './config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, RedisClientOptions } from '@keyv/redis';
import redisConfig, { RedisConfig } from './config/redis.config';
import { TodosModule } from './modules/todo/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig: TypeOrmModuleOptions | undefined =
          configService.get<TypeOrmModuleOptions>('database');

        if (!databaseConfig) {
          throw new ConfigNotInitializedException('databaseConfig');
        }

        return databaseConfig;
      },
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const redisConfig: RedisConfig | undefined =
          configService.get<RedisConfig>('redis');

        if (!redisConfig) {
          throw new ConfigNotInitializedException('redisConfig');
        }

        const redisOptions: RedisClientOptions = {
          username: redisConfig.username,
          password: redisConfig.password,

          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        };

        return {
          stores: [createKeyv(redisOptions)],
        };
      },
    }),
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
