import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Store } from './store';

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('uuid')
    storeId!: string;

    @ManyToOne(() => Store, store => store.reviews)
    @JoinColumn({ name: 'storeId' })
    store!: Store;

    @Column('uuid')
    userId!: string;

    // @ManyToOne(() => User)
    // @JoinColumn({ name: 'userId' })
    // user: User;

    @Column('text')
    content!: string;

    @Column('float')
    rating!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
