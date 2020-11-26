import { Action } from '@ngrx/store';
import { Creditcard } from '../models/creditcard.model';
import * as CreditcardActions from '../actions/creditcard.actons';
// import { statSync } from 'fs';

const initialState: Creditcard = {
  cardNumber: '1111222277778888',
  cardHolderName: 'THIS IS A INITIALSTATE',
  expirationDate: 'MAY 2022',
  // expirationMonth: '11',
  // expirationYear: '2022',
  totalAmount: 777,
  cvv: '888'
};

export function reducer(
  state: Creditcard[] = [initialState],
  action: CreditcardActions.Actions
) {
  switch (action.type) {
    case CreditcardActions.ADD_CREDITCARD:
      return [...state, action.payload];

    default:
      [...state, action.payload];
  }
}
