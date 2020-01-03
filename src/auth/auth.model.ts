import { User } from '../users/user.model';

export class AccessInfo {
  constructor(public token: string, public user: User) {}
}

export class JWTPayload {
  constructor(public username: string, public sub: string) {}
}
