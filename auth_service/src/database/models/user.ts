import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsEmail, IsPhoneNumber, MinLength } from "class-validator";

export enum Role {
    Admin="admin",
    Owner="owner",
    Customer="customer",
    Rider="rider",
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    @MinLength(2)
    name!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    @MinLength(8)
    password!: string;

    @Column({ unique: true })
    @IsPhoneNumber()
    phone_number!: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ default: 'customer', enum: Role })
    role!: Role;

    @Column({ default: false })
    is_verified!: boolean;

    @Column({ nullable: true })
    refresh_token?: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
