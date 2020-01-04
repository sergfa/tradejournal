import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommonService {
  private readonly _saltSize: number = +process.env.HASH_SALT_SIZE;

  async generateHash(term: string) {
    const salt = await bcrypt.genSalt(this._saltSize);
    const hash = await bcrypt.hash(term, salt);
    return hash;
  }

  async compareHash(term: string, hash: string) {
    return await bcrypt.compare(term, hash);
  }
}
