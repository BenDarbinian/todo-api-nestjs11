import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEmailVerificationTokensTable1770290819164 implements MigrationInterface {
  name = 'CreateEmailVerificationTokensTable1770290819164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`email_verification_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`email\` varchar(255) NOT NULL, \`token_hash\` varchar(64) NOT NULL, \`expires_at\` datetime(6) NOT NULL, \`used_at\` datetime(6) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` (\`token_hash\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`email_verified_at\` datetime(6) NULL AFTER \`password_hash\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`date\` \`date\` date NULL DEFAULT CURRENT_DATE`);
    await queryRunner.query(`ALTER TABLE \`email_verification_tokens\` ADD CONSTRAINT \`FK_fdcb77f72f529bf65c95d72a147\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`email_verification_tokens\` DROP FOREIGN KEY \`FK_fdcb77f72f529bf65c95d72a147\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`date\` \`date\` date NULL DEFAULT curdate()`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email_verified_at\``);
    await queryRunner.query(`DROP INDEX \`IDX_c20ed35f3d31d486aabcd0564d\` ON \`email_verification_tokens\``);
    await queryRunner.query(`DROP TABLE \`email_verification_tokens\``);
  }
}
