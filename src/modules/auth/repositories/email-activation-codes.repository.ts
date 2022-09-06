import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmailActivationCodesEntity } from '../entities/user-email-activation-codes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmailActivationCodesRepository {
  constructor(
    @InjectRepository(UserEmailActivationCodesEntity)
    private readonly codesRepo: Repository<UserEmailActivationCodesEntity>,
  ) {}

  async saveCode(userId: string, code: number) {
    let userCode = await this.getByUserId(userId);
    if (!userCode) {
      userCode = new UserEmailActivationCodesEntity();
      userCode.userId = userId;
    }
    userCode.code = code;
    userCode.createdAt = new Date();
    return this.codesRepo.save(userCode);
  }

  getByUserId(userId: string) {
    return this.codesRepo.findOne({ where: { userId } });
  }

  async remove(userId: string) {
    await this.codesRepo.delete({ userId });
  }
}
