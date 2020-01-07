import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { SymbolEntity } from './symbol.entity';
import { SymbolsController } from './symbols.controller';
import { SymbolsService } from './symbols.service';

@Module({
  providers: [SymbolsService],
  controllers: [SymbolsController],
  imports: [
    AzureTableStorageModule.forFeature(SymbolEntity, {
      table: process.env.SYMBOL_TABLE,
      createTableIfNotExists: true,
    }),
  ],
})
export class SymbolsModule {}
