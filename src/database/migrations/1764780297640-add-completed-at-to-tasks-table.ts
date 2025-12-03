import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompletedAtToTasksTable1764780297640 implements MigrationInterface {
  name = 'AddCompletedAtToTasksTable1764780297640';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`completed_at\` datetime(6) NULL AFTER \`description\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`completed_at\``);
  }
}
