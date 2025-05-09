import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn
} from 'typeorm';
import { IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { User } from './user.entity';

export enum LeaveType {
  SICK = 'sick',
  COMPENSATORY = 'compensatory',
  ANNUAL = 'annual',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Leave{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.leaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: LeaveType })
  @IsEnum(LeaveType)
  @IsNotEmpty()
  type: LeaveType;

  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  @IsEnum(LeaveStatus)
  @IsNotEmpty()
  status: LeaveStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
