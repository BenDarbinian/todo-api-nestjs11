import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTodosToTasks1759341162038 implements MigrationInterface {
  name = 'RenameTodosToTasks1759341162038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`todos\` RENAME TO \`tasks\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` RENAME TO \`todos\``);
  }
}
