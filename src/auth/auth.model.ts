import { UserEntity } from 'src/users/user.entity';

export class AccessInfo {
  constructor(public token: string, public user: UserEntity) {}
}

export class JWTPayload {
  constructor(public username: string, public sub: string) {}
}
