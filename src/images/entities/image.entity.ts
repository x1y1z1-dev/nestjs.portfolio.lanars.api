import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comments.entity';

@Entity()
export class Image {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true, type: 'text' })
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
