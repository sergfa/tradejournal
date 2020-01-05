import {
  InjectRepository,
  Repository,
  AzureTableStorageResponse,
} from '@nestjs/azure-database';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findOneByName(username: string): Promise<UserEntity | undefined> {
    try {
      const users = await this._userRepository.findAll();
      return users.entries.find(user => user.username === username);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      const users = await this._userRepository.findAll();
      return users.entries.find(user => user.email === email);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async create(userEntity: UserEntity): Promise<UserEntity> {
    try {
      return await this._userRepository.create(userEntity);
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async getAll(): Promise<UserEntity[]> {
    try {
      const users = await this._userRepository.findAll();
      return users.entries ? users.entries : [];
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async deleteUser(rowKey: string): Promise<boolean> {
    try {
      const response: AzureTableStorageResponse = await this._userRepository.delete(
        rowKey,
        new UserEntity(),
      );
      if (response.statusCode === 204) {
        return true;
      } else {
        throw new UnprocessableEntityException(response.error);
      }
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }
}
