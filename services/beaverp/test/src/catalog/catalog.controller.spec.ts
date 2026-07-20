import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from '../../../src/catalog/catalog.controller';
import { CatalogService } from '../../../src/catalog/catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [CatalogService],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
