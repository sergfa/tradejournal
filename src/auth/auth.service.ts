import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.model';
import { UsersService } from '../users/users.service';
import { AccessInfo, JWTPayload } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
  ) {}

  async validateUser(username: string, userpassword: string): Promise<User> {
    const user = await this._usersService.findOne(username);
    if (user && user.password === userpassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User): Promise<AccessInfo> {
    const payload = Object.assign(
      {},
      new JWTPayload(user.username, user.userId),
    );
    return new AccessInfo(this._jwtService.sign(payload), user);
  }
}
