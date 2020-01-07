import {
  InjectRepository,
  Repository,
  AzureTableStorageQuery,
} from '@nestjs/azure-database';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SymbolEntity } from './symbol.entity';

@Injectable()
export class SymbolsService {
  constructor(
    @InjectRepository(SymbolEntity)
    private readonly _symbolRepository: Repository<SymbolEntity>,
  ) {}

  async create(symbol: SymbolEntity): Promise<SymbolEntity> {
    try {
      return await this._symbolRepository.create(symbol);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
  async findByExchange(exchange: string) {
    try {
      const query: AzureTableStorageQuery = this._symbolRepository.where(
        'exchange eq ?',
        exchange,
      );
      const result = await this._symbolRepository.findAll(query);
      return result.entries;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
