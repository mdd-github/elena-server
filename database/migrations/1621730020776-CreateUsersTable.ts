import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsersTable1621730020776 implements MigrationInterface {
    name = 'CreateUsersTable1621730020776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password_hash` varchar(255) NOT NULL, `first_name` varchar(255) NOT NULL, `last_name` varchar(255) NULL, `role` varchar(255) NOT NULL DEFAULT 'employee', `banned` tinyint NOT NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
    }

}
