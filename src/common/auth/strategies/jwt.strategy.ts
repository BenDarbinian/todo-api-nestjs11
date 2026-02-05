import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { JwtConfig } from '../../../config/jwt.config';
import { User } from '../../../modules/users/entities/user.entity';
import { UsersService } from '../../../modules/users/users.service';
import { ConfigNotInitializedException } from '../../exceptions/config-not-initialized.exception';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    const jwtConfig: JwtConfig | undefined =
      configService.get<JwtConfig>('jwt');

    if (!jwtConfig) {
      throw new ConfigNotInitializedException('jwtConfig');
    }

    const opt: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
      passReqToCallback: true,
    };

    super(opt);
  }

  async validate(@Req() req: Request, payload: JwtPayload): Promise<User> {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    if (!token || (await this.authService.isTokenRevoked(token))) {
      throw new UnauthorizedException();
    }

    const user: User | null = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException();
    }

    if (user.passwordChangedAt) {
      const passwordChangedTimestamp: number = user.passwordChangedAt.getTime();
      const issuedAtTimestamp: number = payload.iat * 1000;

      if (issuedAtTimestamp < passwordChangedTimestamp) {
        throw new UnauthorizedException();
      }
    }

    const payloadEmailVerifiedAt = payload.emailVerifiedAt ?? null;
    const userEmailVerifiedAt = user.emailVerifiedAt.getTime();

    if (payloadEmailVerifiedAt !== userEmailVerifiedAt) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
