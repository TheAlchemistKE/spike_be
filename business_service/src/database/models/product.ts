import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store';
import { Category } from './category';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    storeId!: string;

    @ManyToOne(() => Store, store => store.products)
    @JoinColumn({ name: 'storeId' })
    store!: Store;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column('float')
    price!: number;

    @Column('int')
    stock!: number;

    @ManyToOne(() => Category, category => category.products)
    @JoinColumn({ name: 'categoryId' })
    category!: Category;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
