import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Uuid } from '../../../core/value-objects/uuid';
import { randomNumber } from '../../../core/helpers';
import { EmailActivationCodesRepository } from '../repositories/email-activation-codes.repository';
import { ConfigService } from '@nestjs/config';

const FROM_CODE = 100000;
const TO_CODE = 999999;

@Injectable()
export class ActivationCodeService {
  constructor(private readonly codeRepo: EmailActivationCodesRepository, private readonly config: ConfigService) {}

  async generate(userUuid: Uuid) {
    const code = randomNumber(FROM_CODE, TO_CODE);
    await this.codeRepo.saveCode(userUuid, code);
    return code;
  }

  async isCodeExpire(userUuid: Uuid, code: number): Promise<boolean> {
    const userCode = await this.codeRepo.getByUserUuid(userUuid);
    if (!userCode) {
      return false;
    }
    if (userCode.code !== code) {
      return false;
    }

    const diffMinutes = DateTime.fromJSDate(userCode.createdAt).diffNow('minutes').minutes;
    const expireMinutes = this.config.get<number>('CONFIRM_EMAIL_EXPIRE_MINUTES', 30);
    return diffMinutes < expireMinutes;
  }

  async clear(userUuid: Uuid): Promise<void> {
    await this.codeRepo.remove(userUuid);
  }
}
