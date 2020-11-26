import { Component, OnInit } from '@angular/core';
import { CardLabel, FormLabel } from 'ngx-interactive-paycard';
import {Store} from '@ngrx/store';
import { Appstate } from '../../app.state'
import {Creditcard} from '../../models/creditcard.model'
import * as CreditcardActions from '../../actions/creditcard.actons';

import { from } from 'rxjs';

 

 

@Component({
  selector: 'app-credit-card-dto',
  templateUrl: './credit-card-dto.component.html',
  styleUrls: ['./credit-card-dto.component.scss'],
 

})


export class CreditCardDTOComponent implements OnInit {

  title = 'FiledAngularTest';
   
  cardNumberFormat = "#### #### #### ####";
  cardNumberMask = "#### #### #### ####";
  cardLabel: CardLabel = {
    expires: 'VALID THRU',
    cardHolder: 'Cardholder Name',
    fullName: 'Enter Full Name',
    mm: 'MM',
    yy: 'YY',
};
formLabel: FormLabel = {
  cardNumber: 'Card Number',
  cardHolderName: 'Cardholder Name',
  expirationDate: 'Expiration Date',
  expirationMonth: 'Mounth',
  expirationYear: 'Year',
  cvv: 'CVV',
  submitButton: 'SUBMIT',
};
  
onSubmitEvent($event) {
 console.log(this.formLabel);
// console.log(this.addCreditcard);
 
 
}
  constructor(private store: Store<Appstate>) { }

  // addCreditcard(cardNumber, cardHolderName){
  //   this.store.dispatch(new CreditcardActions.AddCreditcard({cardNumber: cardNumber,cardHolderName:cardHolderName }))
  // }
  

ngOnInit(){
 

}


}