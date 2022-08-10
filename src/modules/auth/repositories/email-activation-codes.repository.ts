import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEmailActivationCodesEntity } from '../entities/user-email-activation-codes.entity';
import { Repository } from 'typeorm';
import { Uuid } from '../../../core/value-objects/uuid';

@Injectable()
export class EmailActivationCodesRepository {
  constructor(
    @InjectRepository(UserEmailActivationCodesEntity)
    private readonly codesRepo: Repository<UserEmailActivationCodesEntity>,
  ) {}

  async saveCode(userUuid: Uuid, code: number) {
    let userCode = await this.getByUserUuid(userUuid);
    if (!userCode) {
      userCode = new UserEmailActivationCodesEntity();
      userCode.userUuid = userUuid;
    }
    userCode.code = code;
    userCode.createdAt = new Date();
    return this.codesRepo.save(userCode);
  }

  getByUserUuid(userUuid: Uuid) {
    return this.codesRepo.findOne({ where: { userUuid } });
  }

  async remove(userUuid: Uuid) {
    await this.codesRepo.delete({ userUuid });
  }
}
