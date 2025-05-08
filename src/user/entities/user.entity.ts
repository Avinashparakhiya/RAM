import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne 
} from 'typeorm';
import { IsEmail, IsNotEmpty } from "class-validator";

export enum UserRole {
  ADMIN = 'admin',
  HOD = 'hod',
  EMPLOYEE = 'employee'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true }) // Self-referential relationship
  manager: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  // Add inverse relation for subordinates (optional, useful for querying)
  subordinates: User[];
}
