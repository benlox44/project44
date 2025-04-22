import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @Column({ default: false })
  public isLocked: boolean;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column({ unique: true })
  public email: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Column({ type: 'varchar', nullable: true })
  public oldEmail: string | null;

  @Column({ type: 'varchar', nullable: true })
  public newEmail: string | null;

  @Column({ type: 'timestamp', nullable: true })
  public emailChangedAt: Date | null;
}
