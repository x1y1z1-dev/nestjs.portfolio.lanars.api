import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Image } from 'src/image/entities/image.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	name: string;

	@Column()
	passwordHash: string;

	@Column({ nullable: true })
	currentHashedRefreshToken?: string;

	@OneToMany(() => Portfolio, p => p.owner, { cascade: true })
	portfolios: Portfolio[];

	@OneToMany(() => Comment, c => c.author)
	comments: Comment[];

	@OneToMany(() => Image, i => i.uploader)
	images: Image[];

	@CreateDateColumn()
	createdAt: Date;
}
