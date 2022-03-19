import {MigrationInterface, QueryRunner} from "typeorm";

export class userfields1647709698815 implements MigrationInterface {
    name = 'userfields1647709698815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `used_invites` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `email_code` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` ADD `email_confirmed` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `users` CHANGE `last_name` `last_name` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `trial_expires_at` `trial_expires_at` datetime NOT NULL DEFAULT NOW()");
        await queryRunner.query("ALTER TABLE `sessions` DROP FOREIGN KEY `FK_085d540d9f418cfbdc7bd55bb19`");
        await queryRunner.query("ALTER TABLE `sessions` CHANGE `user_id` `user_id` int NULL");
        await queryRunner.query("ALTER TABLE `sessions` ADD CONSTRAINT `FK_085d540d9f418cfbdc7bd55bb19` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `sessions` DROP FOREIGN KEY `FK_085d540d9f418cfbdc7bd55bb19`");
        await queryRunner.query("ALTER TABLE `sessions` CHANGE `user_id` `user_id` int NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `sessions` ADD CONSTRAINT `FK_085d540d9f418cfbdc7bd55bb19` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users` CHANGE `trial_expires_at` `trial_expires_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP()");
        await queryRunner.query("ALTER TABLE `users` CHANGE `last_name` `last_name` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `email_confirmed`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `email_code`");
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `used_invites`");
    }

}
