import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToTasksTable1761834509547 implements MigrationInterface {
  name = 'AddUserIdToTasksTable1761834509547';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`user_id\` int NOT NULL AFTER \`id\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_db55af84c226af9dce09487b61b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_db55af84c226af9dce09487b61b\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`user_id\``);
  }
}
