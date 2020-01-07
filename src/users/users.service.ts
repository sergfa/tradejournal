import {
  AzureTableStorageResponse,
  InjectRepository,
  Repository,
} from '@nestjs/azure-database';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  _logger = new Logger('UsersService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepository: Repository<UserEntity>,
  ) {}

  async findOneByName(username: string): Promise<UserEntity | undefined> {
    try {
      const users = await this._userRepository
        .where('username eq ?', username)
        .findAll();
      return users.entries && users.entries.length > 0
        ? users.entries[0]
        : undefined;
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      const users = await this._userRepository
        .where('email eq ?', email)
        .findAll();
      return users.entries && users.entries.length > 0
        ? users.entries[0]
        : undefined;
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
