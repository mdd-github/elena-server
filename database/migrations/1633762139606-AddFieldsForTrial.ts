import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFieldsForTrial1633762139606 implements MigrationInterface {
    name = 'AddFieldsForTrial1633762139606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`trial_expires_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_trial\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_name\` \`last_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_085d540d9f418cfbdc7bd55bb19\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`id\` char(36) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD UNIQUE INDEX \`IDX_c0e1ed5b0fb7f3ff8525442470\` (\`fingerprint\`)`);
        await queryRunner.query(`ALTER TABLE \`sessions\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_085d540d9f418cfbdc7bd55bb19\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP FOREIGN KEY \`FK_085d540d9f418cfbdc7bd55bb19\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` CHANGE \`user_id\` \`user_id\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP INDEX \`IDX_c0e1ed5b0fb7f3ff8525442470\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`sessions\` ADD CONSTRAINT \`FK_085d540d9f418cfbdc7bd55bb19\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`last_name\` \`last_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_trial\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`trial_expires_at\``);
    }

}
