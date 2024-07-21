import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
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

    @OneToOne(() => Profile)
    @JoinColumn()
    profile!: Profile;
}
