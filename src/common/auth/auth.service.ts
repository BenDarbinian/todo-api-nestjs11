import { Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as Sentry from '@sentry/node';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { SessionConfig } from '../../config/session.config';
import { User } from '../../modules/users/entities/user.entity';
import { UsersService } from '../../modules/users/users.service';
import { ConfigNotInitializedException } from '../exceptions/config-not-initialized.exception';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  private readonly sessionConfig: SessionConfig;

  constructor(
    private readonly cacheManager: Cache,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    const sessionConfig: SessionConfig | undefined =
      configService.get<SessionConfig>('session');

    if (!sessionConfig) {
      throw new ConfigNotInitializedException('sessionConfig');
    }

    this.sessionConfig = sessionConfig;
  }

  public async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user: User | null = await this.validateUser(dto.email, dto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException('Email is not verified.');
    }

    const { expiresAt, refreshAfter } = this.getTokenExpirationTimes();

    return {
      accessToken: this.generateAccessToken(
        user.id,
        refreshAfter,
        user.emailVerifiedAt.getTime(),
      ),
      expiresAt: new Date(expiresAt).toISOString(),
      refreshAfter: new Date(refreshAfter).toISOString(),
    };
  }

  public async refresh(token: string): Promise<AuthResponseDto> {
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch (exception) {
      Sentry.captureException(exception);
      throw new UnauthorizedException();
    }

    if (Date.now() < payload.refreshAfter) {
      throw new BadRequestException(
        `Token cannot be refreshed before ${new Date(payload.refreshAfter).toISOString()}.`,
      );
    }

    await this.revokeToken(token);

    const { expiresAt, refreshAfter } = this.getTokenExpirationTimes();

    return {
      accessToken: this.generateAccessToken(
        payload.sub,
        refreshAfter,
        payload.emailVerifiedAt ?? null,
      ),
      expiresAt: new Date(expiresAt).toISOString(),
      refreshAfter: new Date(refreshAfter).toISOString(),
    };
  }

  public async revokeToken(token: string): Promise<void> {
    const ttl: number = this.sessionConfig.lifetimeMs;

    await this.cacheManager.set(token, 'revoked', ttl);
  }

  public async isTokenRevoked(token: string): Promise<boolean> {
    const storedToken = await this.cacheManager.get(token);

    return storedToken === 'revoked';
  }

  private async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user: User | null = await this.usersService.findOneByEmail(email);

    if (
      user &&
      (await this.hashService.compare(plainPassword, user.passwordHash))
    ) {
      return user;
    }

    return null;
  }

  private getTokenExpirationTimes(): {
    expiresAt: number;
    refreshAfter: number;
  } {
    const now: number = Date.now();
    const expiresAt: number = now + this.sessionConfig.lifetimeMs;
    const refreshAfter: number = now + this.sessionConfig.refreshThresholdMs;

    return { expiresAt, refreshAfter };
  }

  private generateAccessToken(
    userId: number,
    refreshAfter: number,
    emailVerifiedAt: number | null,
  ): string {
    return this.jwtService.sign(
      { sub: userId, refreshAfter, emailVerifiedAt },
      { expiresIn: this.sessionConfig.lifetimeMs / 1000 },
    );
  }
}
