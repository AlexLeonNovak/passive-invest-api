import { Uuid } from '../../../../core/value-objects/uuid';

export class GetByUuidQuery {
  constructor(public readonly uuid: Uuid) {}
}
