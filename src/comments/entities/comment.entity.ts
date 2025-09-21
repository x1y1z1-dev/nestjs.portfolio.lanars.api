import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Image } from '../../images/entities/image.entity';

@Entity()
export class Comment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	text: string;

	@ManyToOne(() => User, user => user.comments, { onDelete: 'SET NULL' })
	author: User;

	@ManyToOne(() => Image, image => image.comments, { onDelete: 'CASCADE' })
	image: Image;

	@CreateDateColumn()
	createdAt: Date;
}
