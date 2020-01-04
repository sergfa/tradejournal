import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDTO } from './user.model';

@Injectable()
export class UniqueEmailValidationPipe implements PipeTransform<any> {
  constructor(private readonly _userService: UsersService) {}

  async transform(userData: UserDTO, metadata: ArgumentMetadata) {
    if (!userData) {
      throw new BadRequestException('No data submitted');
    }
    const userEntity = await this._userService.findOneByEmail(userData.email);
    if (userEntity) {
      throw new BadRequestException('Email already exist.');
    }
    return userData;
  }
}
