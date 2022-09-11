import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserAuthProvider } from '../../../core/enums/user.enum';
import { UserEntity } from '../../users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('user_entity_sources')
export class UserAuthSourcesEntity<T extends object = any> extends BaseEntity {
  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn()
  user: UserEntity;

  @Column()
  userId: string;

  @Column({ length: 16, nullable: false })
  provider: UserAuthProvider;

  @Column({ unique: true, nullable: false })
  @Index()
  identifier: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'jsonb', nullable: true })
  extraFields: T;
}
