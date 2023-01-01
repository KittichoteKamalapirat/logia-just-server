import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { Repository } from 'typeorm';
import { AppService } from '../../app.service';
import { distDir } from '../../constants';
import { GenerateVidFromMp4AndMp3Input } from '../../types/GenerateVidFromMp4AndMp3Input';
import { searchFreeSound } from '../../utils/searchFreeSound';
import { searchPexel } from '../../utils/searchPexel';
import { searchPexelPhoto } from '../../utils/searchPexelPhoto';
import { CreateVideoInput } from './dto/create-video.input';
import { Video, VideoType } from './entities/video.entity';

ffmpeg.setFfmpegPath(ffmpegPath.path);

@Injectable()
export class VideosService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectRepository(Video)
    private videossRepository: Repository<Video>,
  ) {}

  //   @Cron(CronExpression.EVERY_SECOND)
  // @Timeout(1000)
  async createVidFromMp4AndMp3(query: string) {
    const freeSoundResult = await searchFreeSound({ query });
    const pexelResult = await searchPexel('rain');

    console.log('freeSoundResult', freeSoundResult);
    console.log('pexelResult', pexelResult);

    const vidInput = {
      filename: 'file name',
      clipUrl: pexelResult.clip.videos[0].video_files[0].link,
      audUrl: freeSoundResult.sound.results[0].previews['preview-hq-mp3'],
      durationHr: '0.001',
    };
    this.generateVidFromMp4AndMp3(vidInput);
  }

  async createClipVidAndUpload() {
    // TODO
  }
  //   @Cron(CronExpression.EVERY_SECOND)
  // @Timeout(1000)
  async createVidFromImgAndMp3(query: string) {
    const freeSoundResult = await searchFreeSound({ query });
    const pexelResult = await searchPexelPhoto('rain');

    console.log('freeSoundResult', freeSoundResult);
    console.log('pexelResult', pexelResult);
    console.log('pexelResult', JSON.stringify(freeSoundResult, null, 4));

    const pexelIdx = Math.floor(Math.random() * pexelResult.img.photos.length);
    const freesoundIdx = Math.floor(
      Math.random() * freeSoundResult.sound.results.length,
    );

    const freeSoundId = freeSoundResult.sound.results[freesoundIdx].id;
    const pexelId = pexelResult.img.photos[pexelIdx].id;

    const filename = `pexel_${pexelId}_freesound_${freeSoundId}`;
    console.log('freesoundIdx', freesoundIdx);
    console.log('xxxxx', freeSoundResult.sound.results[freesoundIdx]);
    console.log('yyyy', freeSoundResult.sound.results[freesoundIdx].previews);

    const vidInput = {
      filename,
      imgUrl: pexelResult.img.photos[pexelIdx].src.landscape,
      audUrl:
        freeSoundResult.sound.results[freesoundIdx].previews['preview-hq-mp3'],
      durationHr: '0.001',
    };
    await this.generateVidFromImgAndMp3(vidInput);

    const localVidPath = `${distDir}/../tmp/${filename}.mp4`; //root = dist (when compiled)
    const localThumbPath = `${distDir}/../tmp/${filename}.jpg`;

    return { localVidPath, localThumbPath };
  }

  // This method can generate clip, gen aud, gen img from url
  async genArrbufFromUrl({
    url,
    filename,
    type,
  }: {
    url: string;
    filename: string;
    type: 'mp3' | 'mp4' | 'jpg';
  }) {
    // process aud
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data, 'binary');
    const localPath = `${__dirname}/../../../tmp/${filename}.${type}`;
    fs.writeFileSync(localPath, buffer);
    console.log('aud added');

    return { localPath };
  }

  async ffmpegSyncMp4AndMp3({
    localVisualPath,
    localAudPath,
    loopNumInt,
    durationHr,
    localOutputPath,
  }: FfmpegSyncInput) {
    return new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(localVisualPath)
        // .loop(1)
        .inputOptions(['-stream_loop -1'])
        .input(localAudPath)
        .inputOptions(['-r 1', `-stream_loop ${loopNumInt}`])
        .audioCodec('aac')
        // .videoCodec('copy')
        .outputOptions([
          '-vf scale=1280:720',
          '-shortest', // select the shortest length of input streams, which is the video legnth since the audio will be looped infinity
          '-map 1:a:0', // no audio without this line => pick the audio of the second input stream
          '-map 0:v:0', // <inputNo>:<streamNo> pick the video of the first input stream
        ])
        // .output(outputPath);
        .on('error', (error) => {
          console.log('error generating the output:', error);
        })
        .on(
          'progress',
          ({
            timemark,
          }: {
            frames: number;
            currentFps: number;
            currentKbps: number;
            targetSize: number;
            timemark: string;
          }) => {
            // frames: 1867,
            // currentFps: 69,
            // currentKbps: 4366,
            // targetSize: 40192,
            // timemark: '00:01:15.41'
            const hmsmArr = timemark.split(':');
            const currSec =
              +hmsmArr[0] * 60 * 60 + +hmsmArr[1] * 60 + +hmsmArr[2];

            const totalSec = parseFloat(durationHr) * 60 * 60;
            const ratio = currSec / totalSec;
            const percent = Math.round(ratio * 100) / 100; // make 2 decimal
            console.log('Processing: ' + percent + '% done');
          },
        )
        .save(localOutputPath)
        .on('end', () => {
          console.log('finish generating!');
          resolve();
        })
        .on('error', (err) => {
          return reject(new Error(err));
        });
    });
  }

  async ffmpegSyncImgAndMp3({
    localVisualPath,
    localAudPath,
    loopNumInt,
    durationHr,
    localOutputPath,
  }: FfmpegSyncInput) {
    return new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(localVisualPath)
        // .loop(1)
        .inputOptions(['-r 1', '-loop 1'])
        .input(localAudPath)
        .inputOptions(['-r 1', `-stream_loop ${loopNumInt}`])
        // .inputOptions(["-r 1", `-stream_loop 1`])
        .audioCodec('aac')
        // .size("1280x720")
        .outputOptions(['-vf scale=1280:720', '-shortest'])
        // .output(outputPath);
        .on('error', (error) => {
          console.log('error generating the output:', error);
        })
        .on('progress', ({ frames }) => {
          const totalSec = parseFloat(durationHr) * 60 * 60;
          const ratio = (frames * 100) / totalSec;
          const percent = Math.round(ratio * 100) / 100; // make 2 decimal
          console.log('Processing: ' + percent + '% done');
        })
        .save(localOutputPath)
        .on('end', () => {
          console.log('finish generating!');
          resolve();
        })
        .on('error', (err) => {
          return reject(new Error(err));
        });
    });
  }

  async saveOutputToStorage(localOutputPath: string) {
    const data = fs.readFileSync(localOutputPath);

    // const storageOutputPath = `outputs/${filename}/${filename}.mp4`;
    // const storageThumbnailPath = `outputs/${filename}/${filename}.jpg`;
    // save output and thumbnail file itself to storage
    // await admin.storage().bucket().file(storageOutputPath).save(data);
    // await admin.storage().bucket().file(storageThumbnailPath).save(imgBuffer);
    // without .mp4 in the end                        ⬆️
    // the type is application/octet-stream instead of video/mp4
  }

  async deleteLocalFiles({
    localClipPath,
    localAudPath,
    localOutputPath,
  }: {
    localClipPath: string;
    localAudPath: string;
    localOutputPath: string;
  }) {
    // delete the local files
    // fs.unlinkSync(localImgPath);
    // fs.unlinkSync(localAudPath);
    // fs.unlinkSync(localOutputPath);
  }

  async getLoopNum({
    localAudPath,
    durationHr,
  }: {
    localAudPath: string;
    durationHr: string;
  }) {
    // get duration of an audio
    const audDurationSec = await getAudioDurationInSeconds(localAudPath);
    console.log('aud duration', audDurationSec);

    const loopNumFloat = (parseFloat(durationHr) * 60 * 60) / audDurationSec;
    const loopNumInt =
      durationHr !== '12' ? Math.ceil(loopNumFloat) : Math.floor(loopNumFloat); // Youtube maximum is 12 hours
    console.log('creating a ', durationHr, ' hours video');
    console.log('loop num:', loopNumInt);
    return { loopNumInt };
  }

  async generateVidFromMp4AndMp3(data: GenerateVidFromMp4AndMp3Input) {
    const { clipUrl, audUrl, durationHr, filename } = data;
    console.log('clipUrl', clipUrl);
    console.log('audUrl', audUrl);
    console.log('durationHr', durationHr);
    console.log('filename', filename);
    try {
      const { localPath: localClipPath } = await this.genArrbufFromUrl({
        url: clipUrl,
        filename,
        type: 'mp4',
      });
      const { localPath: localAudPath } = await this.genArrbufFromUrl({
        url: audUrl,
        filename,
        type: 'mp3',
      });

      const { loopNumInt } = await this.getLoopNum({
        localAudPath,
        durationHr,
      });

      const localOutputPath = `${__dirname}/../../../tmp/${filename}.mp4`;

      await this.ffmpegSyncMp4AndMp3({
        localVisualPath: localClipPath,
        localAudPath,
        loopNumInt,
        durationHr,
        localOutputPath,
      }); // wait for the video to get generated

      // save output metadata
      const videoInput = {
        title: 'Mock title',
        description: 'mock description',
        category: ['1', '2'],
        videoSrcUrl: 'mck url',
        audioSrcUrl: 'mock url',
        thumbnailPath: '/mock/path',
        videoPath: 'mock/path',
        type: 'from_clip' as VideoType,
      };
      await this.create(videoInput);

      // this.saveOutputToStorage(localOutputPath)
      // this.deleteLocalFiles({ localClipPath, localAudPath, localOutputPath });

      console.log('Completed! 😃');
    } catch (error) {
      console.log('error', error);
    }
    return;
  }

  async generateVidFromImgAndMp3(data: GenerateVidFromImgAndMp3Input) {
    const { imgUrl, audUrl, durationHr, filename } = data;
    console.log('imgUrl', imgUrl);
    console.log('audUrl', audUrl);
    console.log('durationHr', durationHr);
    console.log('filename', filename);
    try {
      const { localPath: localImgPath } = await this.genArrbufFromUrl({
        url: imgUrl,
        filename,
        type: 'jpg',
      });
      const { localPath: localAudPath } = await this.genArrbufFromUrl({
        url: audUrl,
        filename,
        type: 'mp3',
      });

      const { loopNumInt } = await this.getLoopNum({
        localAudPath,
        durationHr,
      });

      const localOutputPath = `${__dirname}/../../../tmp/${filename}.mp4`;

      await this.ffmpegSyncImgAndMp3({
        localVisualPath: localImgPath,
        localAudPath,
        loopNumInt,
        durationHr,
        localOutputPath,
      }); // wait for the video to get generated

      // save output metadata
      const videoInput = {
        title: 'Mock title',
        description: 'mock description',
        category: ['1', '2'],
        videoSrcUrl: 'mck url',
        audioSrcUrl: 'mock url',
        thumbnailPath: '/mock/path',
        videoPath: 'mock/path',
        type: 'from_img' as VideoType,
      };
      await this.create(videoInput);

      // this.saveOutputToStorage(localOutputPath)
      // this.deleteLocalFiles({ localClipPath, localAudPath, localOutputPath });

      console.log('Completed! 😃');
    } catch (error) {
      console.log('error', error);
    }
    return;
  }

  async create(input: CreateVideoInput): Promise<Video> {
    const newVideo = this.videossRepository.create(input);
    return this.videossRepository.save(newVideo);
  }
}
