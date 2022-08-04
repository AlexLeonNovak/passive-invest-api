import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';
import { Uuid } from '../value-objects/uuid';

export class UuidTransformer implements ValueTransformer {
  from(value: string): Uuid {
    return new Uuid(value);
  }

  to({ value }: Uuid): string {
    return value.toString();
  }
}
