import { Column, CreateDateColumn, Entity, Index } from 'typeorm';
import { Uuid } from '../../../core/value-objects/uuid';

@Entity('user_email_activation_codes')
export class UserEmailActivationCodesEntity {
  @Column({ type: 'uuid', unique: true })
  @Index()
  userUuid: Uuid;

  @Column({ type: 'int' })
  @Index()
  code: number;

  @CreateDateColumn()
  createdAt: Date;
}
