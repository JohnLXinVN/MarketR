import { Test, TestingModule } from '@nestjs/testing';
import { CvvController } from './cvv.controller';

describe('CvvController', () => {
  let controller: CvvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvvController],
    }).compile();

    controller = module.get<CvvController>(CvvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
