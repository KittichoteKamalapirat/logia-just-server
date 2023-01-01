import { Field, InputType, Int } from '@nestjs/graphql';
import { VideoType } from '../entities/video.entity';

@InputType()
export class CreateVideoInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [String])
  category: string[];

  @Field()
  videoSrcUrl: string;

  @Field()
  audioSrcUrl: string;

  @Field()
  thumbnailPath: string;

  @Field()
  videoPath: string;

  @Field()
  type: VideoType;
}
