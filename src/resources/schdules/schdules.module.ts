import { Module } from '@nestjs/common';
import { UploadsModule } from '../uploads/uploads.module';
import { VideosModule } from '../videos/videos.module';
import { SchdulesService } from './schdules.service';

@Module({
  providers: [SchdulesService],
  imports: [VideosModule, UploadsModule],
})
export class SchdulesModule {}
