import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Uuid } from '../value-objects/uuid';
import { UuidTransformer } from '../transformers/uuid.transformer';
import { Exclude, Transform } from 'class-transformer';

export class BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @Exclude({ toPlainOnly: true })
  id: number;

  @Column({ type: 'uuid', transformer: new UuidTransformer() })
  @Transform(({ value }) => (value as Uuid)?.value, { toPlainOnly: true })
  @Index({ unique: true })
  uuid: Uuid = Uuid.generate();

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
