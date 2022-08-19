import { v4, validate } from 'uuid';
import { InvalidArgumentException } from '../exceptions/invalid-argument.exception';

export class Uuid {
  constructor(private readonly _value: string) {
    if (!validate(_value)) {
      throw new InvalidArgumentException();
    }
  }

  get value() {
    return this._value;
  }

  public static generate() {
    return new this(v4());
  }

  // toString() {
  //   return this.value;
  // }
}
