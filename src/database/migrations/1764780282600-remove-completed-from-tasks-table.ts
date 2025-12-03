import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCompletedFromTasksTable1764780282600 implements MigrationInterface {
  name = 'RemoveCompletedFromTasksTable1764780282600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`completed\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`completed\` tinyint NOT NULL DEFAULT 0`);
  }
}
