import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Portfolio } from '../../portfolios/entities/portfolio.entity';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity()
export class Image {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ type: 'text' })
	description: string;

	@Column()
	filePath: string;

	@ManyToOne(() => Portfolio, portfolio => portfolio.images, { onDelete: 'CASCADE' })
	portfolio: Portfolio;

	@ManyToOne(() => User, user => user.images, { onDelete: 'SET NULL' })
	uploader: User;

	@OneToMany(() => Comment, comment => comment.image, { cascade: true })
	comments: Comment[];

	@CreateDateColumn()
	createdAt: Date;
}
