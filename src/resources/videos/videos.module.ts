import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideosResolver } from './videos.resolver';
import { VideosService } from './videos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video])],
  providers: [VideosResolver, VideosService],
})
export class VideosModule {}
