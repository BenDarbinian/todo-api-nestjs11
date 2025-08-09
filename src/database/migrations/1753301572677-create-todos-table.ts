import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodosTable1753301572677 implements MigrationInterface {
  name = 'CreateTodosTable1753301572677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`todos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(256) NOT NULL, \`description\` varchar(512) NULL, \`completed\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`todos\``);
  }
}
