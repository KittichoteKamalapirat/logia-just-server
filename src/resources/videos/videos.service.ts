import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from '../../app.service';
import { Video } from './entities/video.entity';
import { searchFreeSound } from '../../utils/searchFreeSound';
import { searchPexel } from '../../utils/searchPexel';

@Injectable()
export class VideosService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectRepository(Video)
    private videossRepository: Repository<Video>,
  ) {}

  //   @Cron(CronExpression.EVERY_SECOND)
  @Timeout(1000)
  async createVideo() {
    // const freeSoundResult = await searchFreeSound('rain');
    const pexelResult = await searchPexel('rain');

    // console.log('freeSoundResult', freeSoundResult);
    console.log('pexelResult', pexelResult);
  }
}
