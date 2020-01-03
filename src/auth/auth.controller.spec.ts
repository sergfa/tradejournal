import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

describe('Auth Controller', () => {
  let controller: AuthController;

  beforeEach(async () => {
    process.env = Object.assign(process.env, {
      JWT_SECRET: 'value',
      JWT_EXPIRE: '1ds',
    });
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [UsersService, AuthService],
      imports: [
        UsersModule,
        AuthModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        }),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
