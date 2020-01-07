import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
} from '@nestjs/azure-database';

@EntityPartitionKey('SymbolID')
@EntityRowKey('SymbolName')
export class SymbolEntity {
  @EntityString() exchange: string;
  @EntityString() code: string;
  @EntityString() name: string;
  RowKey?: string;
}
