import { Column, Entity, Index } from 'typeorm';
import { Uuid } from '../../../core/value-objects/uuid';
import { BaseEntity } from '../../../core/entity/base.entity';

@Entity('user_email_activation_codes')
export class UserEmailActivationCodesEntity extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  @Index()
  userUuid: Uuid;

  @Column({ type: 'int' })
  @Index()
  code: number;
}
