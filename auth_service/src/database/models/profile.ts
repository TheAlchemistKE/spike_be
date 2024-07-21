import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('profile')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    phone_number!: string;

    @Column()
    rating!: string;

    @Column()
    points!: string;


}
