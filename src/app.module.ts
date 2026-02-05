import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigNotInitializedException } from './common/exceptions/config-not-initialized.exception';
import databaseConfig from './config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, RedisClientOptions } from '@keyv/redis';
import redisConfig, { RedisConfig } from './config/redis.config';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { HashModule } from './common/hash/hash.module';
import sessionConfig from './config/session.config';
import jwtConfig from './config/jwt.config';
import { AuthModule } from './common/auth/auth.module';
import frontConfig from './config/front.config';
import mailerConfig from './config/mailer.config';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        sessionConfig,
        jwtConfig,
        frontConfig,
        mailerConfig,
      ],
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
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig: RedisConfig | undefined =
          configService.get<RedisConfig>('redis');

        if (!redisConfig) {
          throw new ConfigNotInitializedException('redisConfig');
        }

        return {
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            username: redisConfig.username,
            password: redisConfig.password,
          },
        };
      },
    }),
    TasksModule,
    UsersModule,
    HashModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
