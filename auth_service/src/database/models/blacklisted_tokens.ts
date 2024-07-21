import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('blacklisted_tokens')
export class BlacklistedTokens {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    token!: string;

    @Column()
    expired_at!: string;

    @Column()
    user_id!: string;
}
