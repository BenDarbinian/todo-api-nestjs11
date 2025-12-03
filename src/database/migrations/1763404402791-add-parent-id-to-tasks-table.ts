import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentIdToTasksTable1763404402791 implements MigrationInterface {
  name = 'AddParentIdToTasksTable1763404402791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_db55af84c226af9dce09487b61b\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`parent_id\` int NULL AFTER \`user_id\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_b03c99063a4eaf084f069a4d5a7\` FOREIGN KEY (\`parent_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_db55af84c226af9dce09487b61b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_db55af84c226af9dce09487b61b\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_b03c99063a4eaf084f069a4d5a7\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`parent_id\``);
    await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_db55af84c226af9dce09487b61b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
