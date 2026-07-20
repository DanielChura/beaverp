import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceController } from '../../../src/marketplace/marketplace.controller';
import { MarketplaceService } from '../../../src/marketplace/marketplace.service';

describe('MarketplaceController', () => {
  let controller: MarketplaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketplaceController],
      providers: [MarketplaceService],
    }).compile();

    controller = module.get<MarketplaceController>(MarketplaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
