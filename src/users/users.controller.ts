import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { UniqueEmailValidationPipe } from './unique.email.validation.pipe';
import { UniqueUserNameValidationPipe } from './unique.username.validation.pipe';
import { UserEntity } from './user.entity';
import { UserDTO } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _commonService: CommonService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({ transform: true }),
    UniqueUserNameValidationPipe,
    UniqueEmailValidationPipe,
  )
  async createUser(
    @Body()
    userData: UserDTO,
  ): Promise<UserEntity> {
    try {
      const userEntity = new UserEntity();
      userData.password = await this._commonService.generateHash(
        userData.password,
      );
      Object.assign(userEntity, userData);
      const newUserEntity: UserEntity = await this._usersService.create(
        userEntity,
      );
      return newUserEntity;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
