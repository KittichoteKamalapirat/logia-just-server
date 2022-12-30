import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppService } from '../../app.service';
import { searchFreeSound } from '../../utils/searchFreeSound';
import { searchPexel } from '../../utils/searchPexel';
import { CreateVideoInput } from './dto/create-video.input';
import { Video } from './entities/video.entity';

interface GenerateVidInput {
  filename: string;
  imgUrl: string;
  audUrl: string;
  durationHr: string;
}

interface Output {
  userId: string;
  id: string;
  filename: string; // for retrieving identifier when upload
  oriImgUrl: string; // for preview in front
  oriAudUrl: string; // for preview in front
  vidPathInStorage: string; // for when uploading
  thumbPathInStorage: string; // for when uploading
  status: 'to_upload' | 'uploaded';
}

ffmpeg.setFfmpegPath(ffmpegPath.path);

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
    const freeSoundResult = await searchFreeSound('rain');
    const pexelResult = await searchPexel('rain');

    console.log('freeSoundResult', freeSoundResult);
    console.log('pexelResult', pexelResult);

    const vidInput = {
      filename: 'file name',
      imgUrl: pexelResult.clip.videos[0].video_files[0].link,
      audUrl: freeSoundResult.sound.results[0].previews['preview-hq-mp3'],
      durationHr: '0.01',
    };
    this.generateVidFromMp4AndMp3(vidInput);
  }

  // async generateVidFromImgAndMp3(data: GenerateVidInput) {
  //   const { imgUrl, audUrl, durationHr, filename } = data;
  //   console.log('imgUrl', imgUrl);
  //   console.log('audUrl', audUrl);
  //   console.log('durationHr', durationHr);
  //   console.log('filename', filename);
  //   try {
  //     const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });

  //     const imgBuffer = Buffer.from(imgRes.data, 'binary');
  //     // const localImgPath = `${STORAGE_PATH}/tmp/${filename}.jpg`;

  //     const localImgPath = `${__dirname}/../../../tmp/${filename}.jpg`;

  //     console.log('1');
  //     fs.writeFileSync(localImgPath, imgBuffer);
  //     console.log('2');

  //     const audRes = await axios.get(audUrl, { responseType: 'arraybuffer' });
  //     const audBuffer = Buffer.from(audRes.data, 'binary');
  //     // const localAudPath = `${STORAGE_PATH}/tmp/${filename}.mp3`;
  //     const localAudPath = `${__dirname}/../../../tmp/${filename}.mp3`;
  //     console.log('3');
  //     fs.writeFileSync(localAudPath, audBuffer);
  //     console.log('4');

  //     const audDurationSec = await getAudioDurationInSeconds(localAudPath);
  //     console.log('duration', audDurationSec);

  //     // const audDuration = await getBlobDuration(audBlob); // in seconds
  //     const loopNumFloat = (parseFloat(durationHr) * 60 * 60) / audDurationSec;
  //     const loopNum =
  //       durationHr !== '12'
  //         ? Math.ceil(loopNumFloat)
  //         : Math.floor(loopNumFloat); // Youtube maximum is 12 hours
  //     console.log('creating a ', durationHr, ' hours video');
  //     console.log('loop num', loopNum);
  //     // // Write the file to memory
  //     // TODO add file name, remove https:www. thingy

  //     // const outputPath = `${STORAGE_PATH}/${filename}.mp4`;
  //     const localOutputPath = `${__dirname}/../../../tmp/${filename}.mp4`;

  //     console.log('5');

  //     const ffmpegSync = () => {
  //       return new Promise<void>((resolve, reject) => {
  //         ffmpeg()
  //           .input(localImgPath)
  //           // .loop(1)
  //           .inputOptions(['-r 1', '-loop 1'])
  //           .input(localAudPath)
  //           .inputOptions(['-r 1', `-stream_loop ${loopNum}`])
  //           // .inputOptions(["-r 1", `-stream_loop 1`])
  //           .audioCodec('aac')
  //           // .size("1280x720")
  //           .outputOptions(['-vf scale=1280:720', '-shortest'])
  //           // .output(outputPath);
  //           .on('error', (error) => {
  //             console.log('error generating the output:', error);
  //           })
  //           .on('progress', ({ frames }) => {
  //             // frames: 226,
  //             // currentFps: 73,
  //             // currentKbps: 122.8,
  //             // targetSize: 3342,
  //             // timemark: '00:03:43.00'
  //             const totalSec = parseFloat(durationHr) * 60 * 60;
  //             const ratio = (frames * 100) / totalSec;
  //             const percent = Math.round(ratio * 100) / 100; // make 2 decimal
  //             console.log('Processing: ' + percent + '% done');
  //           })
  //           .save(localOutputPath)
  //           .on('end', () => {
  //             console.log('finish generating!');
  //             resolve();
  //           })
  //           .on('error', (err) => {
  //             return reject(new Error(err));
  //           });
  //       });
  //     };
  //     console.log('6');

  //     await ffmpegSync(); // wait for the video to genereated

  //     console.log('7');

  //     // outputs/filename/filename.mp4
  //     // outputs/filename/filename.jpg
  //     const storageOutputPath = `outputs/${filename}/${filename}.mp4`;
  //     const storageThumbnailPath = `outputs/${filename}/${filename}.jpg`;

  //     const newOutput: Output = {
  //       userId: 'xxxx',
  //       id: uuidv4(),
  //       filename,
  //       oriImgUrl: imgUrl,
  //       oriAudUrl: audUrl,
  //       vidPathInStorage: storageOutputPath,
  //       thumbPathInStorage: storageThumbnailPath,
  //       status: 'to_upload',
  //     };

  //     const videoInput = {
  //       title: 'Mock title',
  //       description: 'mock description',
  //       category: ['1', '2'],
  //       videoSrcUrl: 'mck url',
  //       audioSrcUrl: 'mock url',
  //       thumbnailPath: '/mock/path',
  //       videoPath: 'mock/path',
  //     };

  //     console.log('8');
  //     // save output metadata to firestore
  //     // await admin.firestore().collection('outputs').add(newOutput);
  //     const newVideo = await this.create(videoInput);

  //     console.log('newwwww', newVideo);

  //     console.log('9');

  //     const data = fs.readFileSync(localOutputPath);
  //     console.log('10');

  //     // save output and thumbnail file itself to storage
  //     // await admin.storage().bucket().file(storageOutputPath).save(data);
  //     // await admin.storage().bucket().file(storageThumbnailPath).save(imgBuffer);
  //     // without .mp4 in the end                        ⬆️
  //     // the type is application/octet-stream instead of video/mp4

  //     // delete the local files
  //     // fs.unlinkSync(localImgPath);
  //     // fs.unlinkSync(localAudPath);
  //     // fs.unlinkSync(localOutputPath);
  //     console.log('11');
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  //   return;
  // }

  async generateVidFromMp4AndMp3(data: GenerateVidInput) {
    const { imgUrl, audUrl, durationHr, filename } = data;
    console.log('imgUrl', imgUrl);
    console.log('audUrl', audUrl);
    console.log('durationHr', durationHr);
    console.log('filename', filename);
    try {
      const imgRes = await axios.get(imgUrl, { responseType: 'arraybuffer' });

      const imgBuffer = Buffer.from(imgRes.data, 'binary');
      // const localImgPath = `${STORAGE_PATH}/tmp/${filename}.jpg`;

      const localImgPath = `${__dirname}/../../../tmp/${filename}.jpg`;

      console.log('1');
      fs.writeFileSync(localImgPath, imgBuffer);
      console.log('2');

      const audRes = await axios.get(audUrl, { responseType: 'arraybuffer' });
      const audBuffer = Buffer.from(audRes.data, 'binary');
      // const localAudPath = `${STORAGE_PATH}/tmp/${filename}.mp3`;
      const localAudPath = `${__dirname}/../../../tmp/${filename}.mp3`;
      console.log('3');
      fs.writeFileSync(localAudPath, audBuffer);
      console.log('4');

      const audDurationSec = await getAudioDurationInSeconds(localAudPath);
      console.log('duration', audDurationSec);

      // const audDuration = await getBlobDuration(audBlob); // in seconds
      const loopNumFloat = (parseFloat(durationHr) * 60 * 60) / audDurationSec;
      const loopNum =
        durationHr !== '12'
          ? Math.ceil(loopNumFloat)
          : Math.floor(loopNumFloat); // Youtube maximum is 12 hours
      console.log('creating a ', durationHr, ' hours video');
      console.log('loop num', loopNum);
      // // Write the file to memory
      // TODO add file name, remove https:www. thingy

      // const outputPath = `${STORAGE_PATH}/${filename}.mp4`;
      const localOutputPath = `${__dirname}/../../../tmp/${filename}.mp4`;

      console.log('5');

      const ffmpegSync = () => {
        return new Promise<void>((resolve, reject) => {
          ffmpeg()
            .input(localImgPath)
            // .loop(1)
            .inputOptions(['-stream_loop -1'])
            .input(localAudPath)
            .inputOptions(['-r 1', `-stream_loop ${loopNum}`])
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
            .on('progress', ({ frames }) => {
              // frames: 226,
              // currentFps: 73,
              // currentKbps: 122.8,
              // targetSize: 3342,
              // timemark: '00:03:43.00'
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
      };
      console.log('6');

      await ffmpegSync(); // wait for the video to genereated

      console.log('7');

      // outputs/filename/filename.mp4
      // outputs/filename/filename.jpg
      const storageOutputPath = `outputs/${filename}/${filename}.mp4`;
      const storageThumbnailPath = `outputs/${filename}/${filename}.jpg`;

      const newOutput: Output = {
        userId: 'xxxx',
        id: uuidv4(),
        filename,
        oriImgUrl: imgUrl,
        oriAudUrl: audUrl,
        vidPathInStorage: storageOutputPath,
        thumbPathInStorage: storageThumbnailPath,
        status: 'to_upload',
      };

      const videoInput = {
        title: 'Mock title',
        description: 'mock description',
        category: ['1', '2'],
        videoSrcUrl: 'mck url',
        audioSrcUrl: 'mock url',
        thumbnailPath: '/mock/path',
        videoPath: 'mock/path',
      };

      console.log('8');
      // save output metadata to firestore
      // await admin.firestore().collection('outputs').add(newOutput);
      const newVideo = await this.create(videoInput);

      console.log('newwwww', newVideo);

      console.log('9');

      const data = fs.readFileSync(localOutputPath);
      console.log('10');

      // save output and thumbnail file itself to storage
      // await admin.storage().bucket().file(storageOutputPath).save(data);
      // await admin.storage().bucket().file(storageThumbnailPath).save(imgBuffer);
      // without .mp4 in the end                        ⬆️
      // the type is application/octet-stream instead of video/mp4

      // delete the local files
      // fs.unlinkSync(localImgPath);
      // fs.unlinkSync(localAudPath);
      // fs.unlinkSync(localOutputPath);
      console.log('11');
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
