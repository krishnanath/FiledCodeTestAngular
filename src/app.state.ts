import { Creditcard } from '../src/models/creditcard.model';

export interface Appstate {
  readonly creditcard: Creditcard[];
}
