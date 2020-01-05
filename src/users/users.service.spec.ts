// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { UserEntity } from './user.entity';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';

describe('UsersService', () => {
  let service: UsersService;
  const defaultUser: UserDTO = {
    username: 'testuser12345',
    password: 'very_secret_password',
    email: 'test@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      imports: [
        CommonModule,
        UsersModule,
        AzureTableStorageModule.forFeature(UserEntity, {
          table: process.env.USER_TABLE,
          createTableIfNotExists: true,
        }),
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    const users = await service.getAll();
    users.forEach(async user => {
      await service.deleteUser(user.RowKey);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const expectedUser = new UserEntity();
    Object.assign(expectedUser, defaultUser);
    const actualUser: UserEntity = await service.create(expectedUser);
    expect(actualUser).toBeDefined();
    expect(actualUser.username).toEqual(expectedUser.username);
  });

  it('should find user by name', async () => {
    const userToCreate = new UserEntity();
    Object.assign(userToCreate, defaultUser);
    const createdUser = await service.create(userToCreate);
    const actualUser = await service.findOneByName(userToCreate.username);
    expect(actualUser).toBeDefined();
    expect(actualUser.RowKey).toBeDefined();
    expect(actualUser.RowKey).toEqual(createdUser.RowKey);
  });

  it('should find user by email', async () => {
    const userToCreate = new UserEntity();
    Object.assign(userToCreate, defaultUser);
    const createdUser = await service.create(userToCreate);
    const actualUser = await service.findOneByEmail(userToCreate.email);
    expect(actualUser.RowKey).toBeDefined();
    expect(actualUser).toBeDefined();
    expect(actualUser.RowKey).toEqual(createdUser.RowKey);
  });

  it('should get all users', async () => {
    const userToCreate = new UserEntity();
    Object.assign(userToCreate, defaultUser);
    await service.create(userToCreate);
    const actualUsers = await service.getAll();
    expect(actualUsers).toBeDefined();
    expect(actualUsers.length).toEqual(1);
  });

  it('should delete user', async () => {
    const userToCreate = new UserEntity();
    Object.assign(userToCreate);
    const createdUser = await service.create(userToCreate);
    await service.deleteUser(createdUser.RowKey);
    const actualUsers = await service.getAll();
    expect(actualUsers).toBeDefined();
    expect(actualUsers.length).toEqual(0);
  });
});
