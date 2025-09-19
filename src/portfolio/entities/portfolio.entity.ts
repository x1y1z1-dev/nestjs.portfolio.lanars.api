import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';

@Entity()
export class Portfolio {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true, type: 'text' })
	description?: string;

	@ManyToOne(() => User, user => user.portfolios, { onDelete: 'CASCADE' })
	owner: User;

	@OneToMany(() => Image, img => img.portfolio, { cascade: true })
	images: Image[];

	@CreateDateColumn()
	createdAt: Date;
}
