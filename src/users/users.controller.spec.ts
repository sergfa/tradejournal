// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        CommonModule,
        UsersModule,
        AzureTableStorageModule.forFeature(UserEntity, {
          table: 'UserEntity',
          createTableIfNotExists: true,
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
