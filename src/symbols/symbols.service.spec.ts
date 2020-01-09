// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Test, TestingModule } from '@nestjs/testing';
import { SymbolsService } from './symbols.service';
import { SymbolEntity } from './symbol.entity';

describe('SymbolsService', () => {
  let service: SymbolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SymbolsService],
      imports: [
        AzureTableStorageModule.forFeature(SymbolEntity, {
          table: process.env.SYMBOL_TABLE,
          createTableIfNotExists: true,
        }),
      ],
    }).compile();

    service = module.get<SymbolsService>(SymbolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create symbol', async () => {
    const symbolEntity = new SymbolEntity();
    Object.assign(symbolEntity, {
      exchange: 'NASDAQ',
      code: 'AAPL',
      name: 'Apple Inc.',
    });
    const createdSymbol = await service.create(symbolEntity);
    expect(createdSymbol).toBeDefined();
    expect(createdSymbol.RowKey).toBeDefined();
  });
});
