import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';

@Injectable()
export class UniqueUserNameValidationPipe implements PipeTransform<any> {
  constructor(private readonly _userService: UsersService) {}

  async transform(userData: UserDTO, metadata: ArgumentMetadata) {
    if (!userData) {
      throw new BadRequestException('No data submitted');
    }
    const userEntity = await this._userService.findOneByName(userData.username);
    if (userEntity) {
      throw new BadRequestException('User name already exist.');
    }
    return userData;
  }
}
