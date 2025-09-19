import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Entity()
export class Image {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true, type: 'text' })
	description?: string;

	@Column()
	filePath: string;

	@ManyToOne(() => Portfolio, p => p.images, { onDelete: 'CASCADE' })
	portfolio: Portfolio;

	@ManyToOne(() => User, u => u.images, { onDelete: 'SET NULL' })
	uploader: User;

	@OneToMany(() => Comment, c => c.image, { cascade: true })
	comments: Comment[];

	@CreateDateColumn()
	createdAt: Date;
}
