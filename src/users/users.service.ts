import { Injectable } from '@nestjs/common';
import { UserDTO } from './user.model';

@Injectable()
export class UsersService {
  private readonly _users: UserDTO[] = [];

  constructor() {
    this._users.push({ username: 'john', password: 'changeme', userId: '1' });
    this._users.push({ username: 'chris', password: 'secret', userId: '2' });
    this._users.push({ username: 'maria', password: 'guess', userId: '3' });
  }

  async findOne(username: string): Promise<UserDTO | undefined> {
    return this._users.find(user => user.username === username);
  }
}
