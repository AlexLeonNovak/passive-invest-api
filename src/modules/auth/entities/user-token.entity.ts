import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { Uuid } from '../../../core/value-objects/uuid';

@Entity('user_tokens')
export class UserTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userUuid: Uuid;

  @Column()
  refreshToken: string;
}
