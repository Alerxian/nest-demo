import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOriginalNameToPhoto1747117760599 implements MigrationInterface {
  name = 'AddOriginalNameToPhoto1747117760599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "photo" 
      ADD "originalname" character varying(255) NULL`,
    );
    // 更新原始文件名
    await queryRunner.query(`
      UPDATE "photo" 
      SET "originalname" = "filename" 
      where "originalname" IS NULL
      `);

    await queryRunner.query(
      `
        ALTER TABLE "photo"
        ALTER COLUMN "originalname" SET NOT NULL
        `,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "photo"."originalname" IS '原始文件名'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "photo"."originalname" IS '原始文件名'`,
    );
    await queryRunner.query(`ALTER TABLE "photo" DROP COLUMN "originalname"`);
  }
}
