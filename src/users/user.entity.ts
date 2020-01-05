import {
  EntityPartitionKey,
  EntityRowKey,
  EntityString,
} from '@nestjs/azure-database';

@EntityPartitionKey('UserID')
@EntityRowKey('UserName')
export class UserEntity {
  @EntityString() username: string;
  @EntityString() password: string;
  @EntityString() email: string;
  RowKey?: string;
}
