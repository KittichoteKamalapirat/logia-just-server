import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type VideoType = 'from_img' | 'from_clip';

@ObjectType()
@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @Column('text', { array: true })
  @Field(() => [String])
  category: string[];

  @Column()
  @Field()
  videoSrcUrl: string;

  @Column()
  @Field()
  audioSrcUrl: string;

  @Column()
  @Field()
  thumbnailPath: string;

  @Column()
  @Field()
  videoPath: string;

  @Column()
  @Field()
  type: VideoType;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
