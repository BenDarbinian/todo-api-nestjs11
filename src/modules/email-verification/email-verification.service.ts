import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { FrontConfig } from '../../config/front.config';
import { ConfigNotInitializedException } from '../../common/exceptions/config-not-initialized.exception';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { User } from '../users/entities/user.entity';
import { MailService } from '../../common/mail/mail.service';

@Injectable()
export class EmailVerificationService {
  private readonly frontConfig: FrontConfig;

  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly tokenRepository: Repository<EmailVerificationToken>,
    private readonly mailService: MailService,
    readonly configService: ConfigService,
  ) {
    const frontConfig: FrontConfig | undefined =
      configService.get<FrontConfig>('front');

    if (!frontConfig) {
      throw new ConfigNotInitializedException('frontConfig');
    }

    this.frontConfig = frontConfig;
  }

  async requestVerification(user: User): Promise<void> {
    if (user.emailVerifiedAt) {
      return;
    }

    const rawToken = await this.createToken(user);
    const verificationLink = this.buildVerificationLink(rawToken);

    await this.mailService.sendEmailVerificationMessage(
      user.email,
      user.name,
      verificationLink,
    );
  }

  async verifyToken(rawToken: string): Promise<User> {
    const tokenHash = this.hashToken(rawToken);

    const token = await this.tokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!token || token.usedAt) {
      throw new BadRequestException('Invalid or expired token.');
    }

    if (token.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invalid or expired token.');
    }

    if (!token.user || token.user.email !== token.email) {
      throw new BadRequestException('Invalid or expired token.');
    }

    token.usedAt = new Date();
    token.user.emailVerifiedAt = new Date();

    await this.tokenRepository.save(token);
    await this.tokenRepository.manager.save(token.user);

    return token.user;
  }

  async invalidateTokensForUser(userId: number): Promise<void> {
    await this.tokenRepository.delete({ userId });
  }

  private async createToken(user: User): Promise<string> {
    await this.invalidateTokensForUser(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const token = this.tokenRepository.create({
      userId: user.id,
      email: user.email,
      tokenHash,
      expiresAt,
      usedAt: null,
    });

    await this.tokenRepository.save(token);

    return rawToken;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private buildVerificationLink(token: string): string {
    return `${this.frontConfig.emailVerificationUrl}?token=${token}`;
  }
}
