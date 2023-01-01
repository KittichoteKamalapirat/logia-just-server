import { Test, TestingModule } from '@nestjs/testing';
import { UploadsModule } from '../uploads/uploads.module';
import { VideosModule } from '../videos/videos.module';
import { SchdulesService } from './schdules.service';

describe('SchdulesService', () => {
  let service: SchdulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchdulesService],
      imports: [VideosModule, UploadsModule],
    }).compile();

    service = module.get<SchdulesService>(SchdulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
