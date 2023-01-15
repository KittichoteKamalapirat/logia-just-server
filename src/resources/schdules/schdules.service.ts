import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { AppService } from '../../app.service';
import { categoryIds } from '../../constants';
import { getRandomSearch } from '../../utils/randItemFromObj';
import { randomTitleAndDes } from '../../utils/randomTitleAndDes';
import { UploadsService } from '../uploads/uploads.service';
import { VideosService } from '../videos/videos.service';

const distDir = dirname(require.main.filename);

@Injectable()
export class SchdulesService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private videosService: VideosService,
    private uploadsService: UploadsService,
  ) {}

  // @Timeout(1000)
  // @Cron(CronExpression.EVERY_30_MINUTES)
  async createPhotoVidAndUpload() {
    const hrNum = 0.5;
    // const natureQuery = randItemFromArr(natureArr);
    const searchText = getRandomSearch();
    const keyword = searchText.youtubeKeyword;
    const emoji = searchText.emoji;
    const pexelQuery = searchText.pexelQuery;
    const freesoundQuery = searchText.freeSoundQuery;

    // create the video
    const { localOutputPath, localThumbPath, localImgPath, localAudPath } =
      await this.videosService.createVidFromImgAndMp3({
        pexelQuery,
        freesoundQuery,
        hrNum,
      });

    // Generate title and description
    const { title, description } = randomTitleAndDes({
      hrNum,
      keyword,
      emoji,
    });

    // upload to Youtube 📹
    const input = {
      localVidPath: localOutputPath,
      localThumbPath,
      title,
      // filename: 'file',
      description,
      tags: [categoryIds.Music, categoryIds.Entertainment],
    };

    // await this.uploadsService.loadSecretAndUploadVideo(input); // TODO
    // await this.videosService.deleteLocalFiles({
    //   localVisualPath: localThumbPath,
    //   localAudPath,
    //   localOutputPath,
    // });
  }

  @Timeout(1000)
  @Cron(CronExpression.EVERY_3_HOURS)
  async createClipVidAndUpload() {
    const hrNum = 2;
    // const natureQuery = randItemFromArr(natureArr);
    const searchText = getRandomSearch();
    const keyword = searchText.youtubeKeyword;
    const emoji = searchText.emoji;
    const pexelQuery = searchText.pexelQuery;
    const freesoundQuery = searchText.freeSoundQuery;

    // create the video
    const { localOutputPath, localThumbPath, localClipPath, localAudPath } =
      await this.videosService.createVidFromMp4AndMp3({
        pexelQuery,
        freesoundQuery,
        hrNum,
      });

    // Generate title and description
    const { title, description } = randomTitleAndDes({
      hrNum,
      keyword,
      emoji,
    });

    // upload to Youtube 📹
    const input = {
      localVidPath: localOutputPath,
      localThumbPath,
      title,
      // filename: 'file',
      description,
      tags: [categoryIds.Music, categoryIds.Entertainment],
    };

    await this.uploadsService.loadSecretAndUploadVideo(input);
    // await this.videosService.deleteLocalFiles({
    //   localVisualPath: localThumbPath,
    //   localAudPath,
    //   localOutputPath,
    // });
  }

  async loadTxtFile(path: string) {
    const data = await fs.readFile(path, 'utf8');
    return data;
  }

  async getDescription() {
    const descriptionPath = `${distDir}/../metadata/description.txt`;
    const description = await this.loadTxtFile(descriptionPath);
    return description;
  }
}
