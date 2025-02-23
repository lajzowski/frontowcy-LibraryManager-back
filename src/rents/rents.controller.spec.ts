import { Test, TestingModule } from '@nestjs/testing';
import { RentsController } from './rents.controller';

describe('RentsController', () => {
  let controller: RentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentsController],
    }).compile();

    controller = module.get<RentsController>(RentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
