import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('user_email_activation_codes')
export class UserEmailActivationCodesEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column()
  @Index()
  userId: string;

  @Column({ type: 'int' })
  @Index()
  code: number;
}
