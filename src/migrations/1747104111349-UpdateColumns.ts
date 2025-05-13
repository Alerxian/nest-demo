import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumns1747104111349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP WITH TIME ZONE,
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP WITH TIME ZONE
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "createdAt" TYPE TIMESTAMP,
      ALTER COLUMN "updatedAt" TYPE TIMESTAMP
      `);
  }
}
