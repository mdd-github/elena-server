import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateSessionTable1621789143845 implements MigrationInterface {
    name = 'CreateSessionTable1621789143845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `sessions` (`id` varchar(36) NOT NULL, `fingerprint` varchar(255) NOT NULL, `expires_at` datetime NOT NULL, `user_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `sessions` ADD CONSTRAINT `FK_085d540d9f418cfbdc7bd55bb19` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sessions` DROP FOREIGN KEY `FK_085d540d9f418cfbdc7bd55bb19`");
        await queryRunner.query("DROP INDEX `IDX_c0e1ed5b0fb7f3ff8525442470` ON `sessions`");
        await queryRunner.query("DROP TABLE `sessions`");
    }

}
