import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    CommonModule,
    AzureTableStorageModule.forFeature(UserEntity, {
      table: process.env.USER_TABLE,
      createTableIfNotExists: true,
    }),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
