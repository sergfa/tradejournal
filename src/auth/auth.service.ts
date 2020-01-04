import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/users/user.entity';
import { CommonService } from '../common/common.service';
import { UsersService } from '../users/users.service';
import { AccessInfo, JWTPayload } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _commonService: CommonService,
  ) {}

  async validateUser(
    username: string,
    userpassword: string,
  ): Promise<UserEntity> {
    const userEntity = await this._usersService.findOneByName(username);
    return userEntity &&
      (await this._commonService.compareHash(userpassword, userEntity.password))
      ? userEntity
      : null;
  }

  async login(user: UserEntity): Promise<AccessInfo> {
    const payload = Object.assign(
      {},
      new JWTPayload(user.username, user.username),
    );
    return new AccessInfo(this._jwtService.sign(payload), user);
  }
}
