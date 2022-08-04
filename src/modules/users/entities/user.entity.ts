import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../core/entity/base.entity';
import { UserRole, UserStatuses } from '../../../core/enums/user.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  passwordHash: string;

  @ApiProperty()
  @Column({ default: UserStatuses.NEW, length: 16 })
  status: UserStatuses;

  @Column({ length: 8, enum: UserRole, default: UserRole.USER })
  roles: UserRole;

  isActive() {
    return this.status === UserStatuses.ACTIVE;
  }

  isWait() {
    return this.status === UserStatuses.WAIT;
  }
}
