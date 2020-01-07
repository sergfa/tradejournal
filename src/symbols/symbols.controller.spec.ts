// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Test, TestingModule } from '@nestjs/testing';
import { SymbolEntity } from './symbol.entity';
import { SymbolsController } from './symbols.controller';

describe('Symbols Controller', () => {
  let controller: SymbolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SymbolsController],
      imports: [
        AzureTableStorageModule.forFeature(SymbolEntity, {
          table: process.env.SYMBOL_TABLE,
          createTableIfNotExists: true,
        }),
      ],
    }).compile();

    controller = module.get<SymbolsController>(SymbolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
