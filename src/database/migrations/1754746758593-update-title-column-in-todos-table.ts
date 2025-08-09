import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTitleColumnInTodosTable1754746758593
  implements MigrationInterface
{
  name = 'UpdateTitleColumnInTodosTable1754746758593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`todos\` MODIFY COLUMN \`title\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`todos\` MODIFY COLUMN \`title\` varchar(256) NOT NULL`,
    );
  }
}
