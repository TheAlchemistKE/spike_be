import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Product} from "./product";

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    ownerId!: string;

    @Column()
    name!: string

    @Column()
    address!: string;

    @Column()
    phone!: string;

    @Column()
    email!: string;

    @OneToMany(() => Product, product => product.store)
    products!: Product[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

}
