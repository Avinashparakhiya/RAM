import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.id, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'timestamp', nullable: true })
    loginTime: Date;

    @Column({ type: 'timestamp', nullable: true })
    logoutTime: Date;

    @Column({ type: 'float', default: 0 })
    totalMinutes: number; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
