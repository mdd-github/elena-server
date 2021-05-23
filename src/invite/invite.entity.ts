import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'invites' })
export class InviteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  value: string;

  @Column({
    name: 'expires_at',
  })
  expiresAt: Date;
}
