import {
  AzureTableStorageResponse,
  InjectRepository,
  Repository,
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
      const rowKey = `${symbol.exchange}:${symbol.code}`;
      return await this._symbolRepository.create(symbol, rowKey);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async delete(rowKey: string): Promise<boolean> {
    try {
      const response: AzureTableStorageResponse = await this._symbolRepository.delete(
        rowKey,
        new SymbolEntity(),
      );
      if (response.statusCode === 204) {
        return true;
      } else {
        throw new UnprocessableEntityException(response.error);
      }
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async find(rowKey: string): Promise<SymbolEntity | undefined> {
    try {
      return await this._symbolRepository.find(rowKey, new SymbolEntity());
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findByExchange(exchange: string): Promise<SymbolEntity[]> {
    try {
      const result = await this._symbolRepository
        .where('exchange eq ?', exchange)
        .findAll();
      return result.entries || [];
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findByCode(code: string): Promise<SymbolEntity | undefined> {
    try {
      code = code || '';
      const result = await this._symbolRepository
        .where('code eq', code.toUpperCase())
        .top(1)
        .findAll();
      return result.entries && result.entries.length > 0
        ? result.entries[0]
        : undefined;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async search(query: string): Promise<SymbolEntity[]> {
    if (query) {
      query = query.toUpperCase();
      try {
        const upperLimitQuery =
          String.fromCharCode(query.charCodeAt(0) + 1) + query.slice(1);
        const result = await this._symbolRepository
          .where('code ge ? and lt ?', query, upperLimitQuery)
          .top(50)
          .findAll();
        return result.entries ? result.entries : [];
      } catch (error) {
        throw new UnprocessableEntityException(error);
      }
    } else {
      try {
        return (await this._symbolRepository.top(50).findAll()).entries;
      } catch (error) {
        throw new UnprocessableEntityException(error);
      }
    }
  }
}
