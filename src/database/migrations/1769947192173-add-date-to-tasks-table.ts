import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateToTasksTable1769947192173 implements MigrationInterface {
  name = 'AddDateToTasksTable1769947192173';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`date\` date NULL DEFAULT CURRENT_DATE AFTER \`description\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`date\``);
  }
}
