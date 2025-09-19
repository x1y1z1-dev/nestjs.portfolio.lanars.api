import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init0001 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

		await queryRunner.query(`
      CREATE TABLE "user" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "email" varchar NOT NULL UNIQUE,
      "passwordHash" varchar NOT NULL,
      "name" varchar,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

		await queryRunner.query(`
      CREATE TABLE "portfolio" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" varchar NOT NULL,
      "description" text,
      "ownerId" uuid REFERENCES "user"(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

		await queryRunner.query(`
      CREATE TABLE "image" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" varchar NOT NULL,
      "description" text,
      "filePath" varchar NOT NULL,
      "portfolioId" uuid REFERENCES "portfolio"(id) ON DELETE CASCADE,
      "uploaderId" uuid REFERENCES "user"(id) ON DELETE SET NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

		await queryRunner.query(`
      CREATE TABLE "comment" (
      "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      "text" text NOT NULL,
      "authorId" uuid REFERENCES "user"(id) ON DELETE SET NULL,
      "imageId" uuid REFERENCES "image"(id) ON DELETE CASCADE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE IF EXISTS "comment"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "image"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "portfolio"`);
		await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
	}
}
