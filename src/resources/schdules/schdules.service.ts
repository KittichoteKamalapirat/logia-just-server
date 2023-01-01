import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { promises as fs } from 'fs';
import { dirname } from 'path';
import { AppService } from '../../app.service';
import { adjArr, categoryIds, purposeArr } from '../../constants';
import { randItemFromArr } from '../../utils/randItemFromArr';
import { randItemsFromArr } from '../../utils/randItemsFromArr';
import { randomTitle } from '../../utils/randomTitle';
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
    const localVidPath = `${distDir}/../tmp/file name.mp4`; //root = dist (when compiled)
    const localThumbPath = `${distDir}/../tmp/file name.jpg`;

    await this.videosService.createVidFromImgAndMp3();

    // Generate title
    const title = randomTitle({ hrNum: 10, nature: 'Rain' });
    // Generate description

    const description = await this.getDescription();
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
