import { InjectRepository, Repository } from '@nestjs/azure-database';
import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findOne(username: string): Promise<UserEntity | undefined> {
    const users = await this._userRepository.findAll();
    return users.entries.find(user => user.username === username);
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    return this._userRepository.create(userEntity);
  }
}
