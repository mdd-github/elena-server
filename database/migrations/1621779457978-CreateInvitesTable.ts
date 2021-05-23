import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInvitesTable1621779457978 implements MigrationInterface {
    name = 'CreateInvitesTable1621779457978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `invites` (`id` int NOT NULL AUTO_INCREMENT, `value` varchar(255) NOT NULL, `expires_at` datetime NOT NULL, UNIQUE INDEX `IDX_53ed5312de7be25cedf62fbb8e` (`value`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP INDEX `IDX_53ed5312de7be25cedf62fbb8e` ON `invites`");
        await queryRunner.query("DROP TABLE `invites`");
    }

}
