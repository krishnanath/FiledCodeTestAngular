import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Creditcard } from '../models/creditcard.model';
// import { type } from 'os';

export const ADD_CREDITCARD = '[CREDITCARD] Add';
export const REMOVE_CREDITCARD = '[CREDITCARD] Remove';

export class AddCreditcard implements Action {
  readonly type = ADD_CREDITCARD;
  constructor(public payload: Creditcard) {}
}

export class RemoveCreditcard implements Action {
  readonly type = REMOVE_CREDITCARD;
  constructor(public payload: number) {}
}

export type Actions = AddCreditcard | RemoveCreditcard;
