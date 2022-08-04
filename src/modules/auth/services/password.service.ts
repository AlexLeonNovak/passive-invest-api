import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  hash = async (password: string) => await argon2.hash(password);

  compare = async (password: string, hash: string) => {
    try {
      return await argon2.verify(hash, password);
    } catch (e) {
      return false;
    }
  };
}
