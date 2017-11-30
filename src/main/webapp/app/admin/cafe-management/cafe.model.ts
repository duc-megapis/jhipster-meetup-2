import { BaseEntity, User } from './../../shared';

export class Cafe implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public users?: User[],
    ) {
    }
}
