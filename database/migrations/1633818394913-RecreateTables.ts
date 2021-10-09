import {MigrationInterface, QueryRunner} from "typeorm";

export class RecreateTables1633818394913 implements MigrationInterface {
    name = 'RecreateTables1633818394913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `invites` (`id` int NOT NULL AUTO_INCREMENT, `value` varchar(255) NOT NULL, `expires_at` datetime NOT NULL, `is_group` tinyint NOT NULL, `limit` int NOT NULL, UNIQUE INDEX `IDX_53ed5312de7be25cedf62fbb8e` (`value`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password_hash` varchar(255) NOT NULL, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `role` varchar(255) NOT NULL DEFAULT 'employee', `banned` tinyint NOT NULL, `trial_expires_at` datetime NOT NULL DEFAULT NOW(), `is_trial` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `sessions` (`id` varchar(36) NOT NULL, `fingerprint` varchar(255) NOT NULL, `expires_at` datetime NOT NULL, `user_id` int NULL, UNIQUE INDEX `IDX_c0e1ed5b0fb7f3ff8525442470` (`fingerprint`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `sessions` ADD CONSTRAINT `FK_085d540d9f418cfbdc7bd55bb19` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sessions` DROP FOREIGN KEY `FK_085d540d9f418cfbdc7bd55bb19`");
        await queryRunner.query("DROP INDEX `IDX_c0e1ed5b0fb7f3ff8525442470` ON `sessions`");
        await queryRunner.query("DROP TABLE `sessions`");
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP INDEX `IDX_53ed5312de7be25cedf62fbb8e` ON `invites`");
        await queryRunner.query("DROP TABLE `invites`");
    }

}
