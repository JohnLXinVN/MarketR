import { Test, TestingModule } from '@nestjs/testing';
import { CvvService } from './cvv.service';

describe('CvvService', () => {
  let service: CvvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CvvService],
    }).compile();

    service = module.get<CvvService>(CvvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
