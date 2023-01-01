import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { AppService } from '../../app.service';
import { categoryIds } from '../../constants';
import { natureArr } from '../../types/NATURE_TYPE_OBJ';
import { randItemFromArr } from '../../utils/randItemFromArr';
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

  @Timeout(1000)
  async createPhotoVidAndUpload() {
    const hrNum = 10;
    const natureQuery = randItemFromArr(natureArr);

    // create the video
    const { localVidPath, localThumbPath } =
      await this.videosService.createVidFromImgAndMp3(natureQuery);

    // Generate title and description
    const { title, description } = randomTitleAndDes({
      hrNum,
      nature: natureQuery,
    });

    // upload to Youtube 📹
    const input = {
      localVidPath,
      localThumbPath,
      title,
      // filename: 'file',
      description,
      tags: [categoryIds.Music, categoryIds.Entertainment],
    };

    await this.uploadsService.loadSecretAndUploadVideo(input);
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
