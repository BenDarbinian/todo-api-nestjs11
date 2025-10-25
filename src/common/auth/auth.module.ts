import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtConfig } from '../../config/jwt.config';
import { ConfigNotInitializedException } from '../exceptions/config-not-initialized.exception';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [
    UsersModule,
    HashModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig: JwtConfig | undefined =
          configService.get<JwtConfig>('jwt');

        if (!jwtConfig) {
          throw new ConfigNotInitializedException('jwtConfig');
        }

        return {
          secret: jwtConfig.secret,
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
