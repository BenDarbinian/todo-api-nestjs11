import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusToEmailVerificationTokensTable1771250721543 implements MigrationInterface {
  name = 'AddStatusToEmailVerificationTokensTable1771250721543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `email_verification_tokens` ADD `sent_at` datetime(6) NULL AFTER `token_hash`');
    await queryRunner.query('UPDATE `email_verification_tokens` SET `sent_at` = COALESCE(`created_at`, NOW(6)) WHERE `sent_at` IS NULL');
    await queryRunner.query('ALTER TABLE `email_verification_tokens` MODIFY `sent_at` datetime(6) NOT NULL');

    await queryRunner.query("ALTER TABLE `email_verification_tokens` ADD `status` enum ('pending', 'sent', 'used', 'expired', 'failed') NOT NULL DEFAULT 'pending' AFTER `used_at`");
    await queryRunner.query("UPDATE `email_verification_tokens` SET `status` = 'used' WHERE `used_at` IS NOT NULL");
    await queryRunner.query("UPDATE `email_verification_tokens` SET `status` = 'expired' WHERE `used_at` IS NULL AND `expires_at` < NOW(6)");
    await queryRunner.query("UPDATE `email_verification_tokens` SET `status` = 'sent' WHERE `status` = 'pending'");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `email_verification_tokens` DROP COLUMN `status`');
    await queryRunner.query('ALTER TABLE `email_verification_tokens` DROP COLUMN `sent_at`');
  }
}
