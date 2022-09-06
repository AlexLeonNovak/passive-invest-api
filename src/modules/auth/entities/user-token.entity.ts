import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('user_tokens')
export class UserTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;
}
