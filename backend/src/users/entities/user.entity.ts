import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  oldEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  newEmail: string | null;

  @Column({ type: 'timestamp', nullable: true })
  emailChangedAt: Date | null;
}
