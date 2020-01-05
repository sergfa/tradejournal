// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CommonModule } from '../common/common.module';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UserDTO } from './user.model';
import { INestApplication } from '@nestjs/common';
import { UsersService } from './users.service';

describe('Users Controller', () => {
  let controller: UsersController;
  let app: INestApplication;
  let userService: UsersService;

  const defaultUser: UserDTO = {
    username: 'testuser12345',
    password: 'very_secret_password',
    email: 'test@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [
        CommonModule,
        UsersModule,
        AzureTableStorageModule.forFeature(UserEntity, {
          table: process.env.USER_TABLE,
          createTableIfNotExists: true,
        }),
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const users = await userService.getAll();
    users.forEach(async user => {
      await userService.deleteUser(user.RowKey);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/POST create user', async () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(defaultUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(201)
      .then(response => {
        expect(response.body.username).toEqual(defaultUser.username);
        expect(response.body.email).toEqual(defaultUser.email);
        expect(response.body.RowKey).toBeDefined();
      });
  });
});
