// tslint:disable-next-line
require('dotenv').config();
import { AzureTableStorageModule } from '@nestjs/azure-database';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDTO } from 'src/users/user.model';
import * as request from 'supertest';
import { CommonModule } from '../common/common.module';
import { UserEntity } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let app: INestApplication;
  let isUserCreated = false;

  const userDTO: UserDTO = {
    username: 'testuser12345',
    password: 'very_secret_password',
    email: 'test@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        CommonModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        }),
        AzureTableStorageModule.forFeature(UserEntity, {
          table: process.env.USER_TABLE,
          createTableIfNotExists: true,
        }),
      ],
      providers: [AuthService, UsersService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    if (isUserCreated) {
      return;
    }
    const users = await usersService.getAll();
    users.forEach(async user => {
      await usersService.deleteUser(user.RowKey);
    });

    await request(app.getHttpServer())
      .post('/users')
      .send(userDTO)
      .set('Accept', 'application/json');
    isUserCreated = true;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should succefully validate user', async () => {
    const userEntity = await authService.validateUser(
      userDTO.username,
      userDTO.password,
    );
    expect(userEntity).toBeTruthy();
  });

  it('should fail to validate user with wrong password', async () => {
    const userEntity = await authService.validateUser(
      userDTO.username,
      userDTO.password.toUpperCase(),
    );
    expect(userEntity).toBeFalsy();
  });

  it('should fail to validate unregistred user', async () => {
    const userEntity = await authService.validateUser(
      'dummy-user',
      userDTO.password,
    );
    expect(userEntity).toBeFalsy();
  });

  it('should succefully login user', async () => {
    const userEntity = await authService.validateUser(
      userDTO.username,
      userDTO.password,
    );
    const accessInfo = await authService.login(userEntity);
    expect(accessInfo).toBeTruthy();
    expect(accessInfo.token).toBeTruthy();
  });
});
