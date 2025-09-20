import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Portfolio } from 'src/portfolios/entities/portfolio.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Image } from 'src/image/entities/image.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	name: string;

	@Exclude()
	@Column()
	passwordHash: string;

	@Exclude()
	@Column({ nullable: true })
	currentHashedRefreshToken?: string;

	@OneToMany(() => Portfolio, portfolio => portfolio.owner, { cascade: true })
	portfolios: Portfolio[];

	@OneToMany(() => Comment, comment => comment.author)
	comments: Comment[];

	@OneToMany(() => Image, image => image.uploader)
	images: Image[];

	@CreateDateColumn()
	createdAt: Date;
}
