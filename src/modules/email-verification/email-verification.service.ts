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
import { SmsVerificationStatus } from './enums/sms-verification-status.enum';

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

    const token = await this.createToken(user);
    const rawToken = token.rawToken;
    const verificationLink = this.buildVerificationLink(rawToken);

    try {
      const isQueued = await this.mailService.sendEmailVerificationMessage(
        user.email,
        user.name,
        verificationLink,
        token.entity.id,
      );

      if (!isQueued) {
        token.entity.status = SmsVerificationStatus.SENT;
        await this.tokenRepository.save(token.entity);
      }
    } catch (error: unknown) {
      token.entity.status = SmsVerificationStatus.FAILED;
      await this.tokenRepository.save(token.entity);
      throw error;
    }
  }

  async verifyToken(rawToken: string): Promise<User> {
    const tokenHash = this.hashToken(rawToken);

    const token = await this.tokenRepository.findOne({
      where: { tokenHash },
      relations: ['user'],
    });

    if (!token || !token.user) {
      throw new BadRequestException('Invalid or expired token.');
    }

    if (token.user.email !== token.email) {
      throw new BadRequestException('Invalid or expired token.');
    }

    if (token.usedAt || token.status === SmsVerificationStatus.USED) {
      if (token.user.emailVerifiedAt) {
        return token.user;
      }

      throw new BadRequestException('Invalid or expired token.');
    }

    if (token.expiresAt.getTime() < Date.now()) {
      if (token.status !== SmsVerificationStatus.EXPIRED) {
        token.status = SmsVerificationStatus.EXPIRED;
        await this.tokenRepository.save(token);
      }
      throw new BadRequestException('Invalid or expired token.');
    }

    if (token.status !== SmsVerificationStatus.SENT) {
      throw new BadRequestException('Invalid or expired token.');
    }

    token.usedAt = new Date();
    token.status = SmsVerificationStatus.USED;
    token.user.emailVerifiedAt = new Date();

    await this.tokenRepository.save(token);
    await this.tokenRepository.manager.save(token.user);

    return token.user;
  }

  async expireActiveTokensForUser(userId: number): Promise<void> {
    await this.tokenRepository
      .createQueryBuilder()
      .update(EmailVerificationToken)
      .set({
        status: SmsVerificationStatus.EXPIRED,
        expiresAt: () => 'NOW(6)',
      })
      .where('user_id = :userId', { userId })
      .andWhere('status IN (:...statuses)', {
        statuses: [SmsVerificationStatus.PENDING, SmsVerificationStatus.SENT],
      })
      .andWhere('used_at IS NULL')
      .execute();
  }

  private async createToken(
    user: User,
  ): Promise<{ rawToken: string; entity: EmailVerificationToken }> {
    await this.expireActiveTokensForUser(user.id);

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const sentAt = new Date();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const token = this.tokenRepository.create({
      userId: user.id,
      email: user.email,
      tokenHash,
      sentAt,
      expiresAt,
      usedAt: null,
      status: SmsVerificationStatus.PENDING,
    });

    const savedToken = await this.tokenRepository.save(token);

    return {
      rawToken,
      entity: savedToken,
    };
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private buildVerificationLink(token: string): string {
    return `${this.frontConfig.emailVerificationUrl}?token=${token}`;
  }
}
