import {Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Profile} from "./profile";


@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    phone_number!: string;

    @Index()
    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;
}
