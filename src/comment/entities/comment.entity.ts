import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Image } from 'src/image/entities/image.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	text: string;

	@ManyToOne(() => User, u => u.comments, { onDelete: 'SET NULL' })
	author: User;

	@ManyToOne(() => Image, i => i.comments, { onDelete: 'CASCADE' })
	image: Image;

	@CreateDateColumn()
	createdAt: Date;
}
