import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Appstate } from '../../../app.state';
import * as CreditcardActions from '../../../actions/creditcard.actons';
import {ToastrService} from 'ngx-toastr';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
 
 

@Component({
  selector: 'app-add-credicard',
  templateUrl: './add-credicard.component.html',
  styleUrls: ['./add-credicard.component.scss']
})
export class AddCredicardComponent implements OnInit {

   

  constructor(private store: Store<Appstate>, private fb: FormBuilder, private toaster: ToastrService) {}

  submitted = false;

  

  showSuccess(){
    this.toaster.success('Thank You, Your Payment Information has been stored with Ngrx');
  }

  

   addCreditcard(cardNumber, cardHolderName, expirationDate, totalAmount, cvv) {
    this.store.dispatch(
      new CreditcardActions.AddCreditcard({
        cardNumber: cardNumber,
        cardHolderName: cardHolderName,
        expirationDate: expirationDate,
        totalAmount: totalAmount,
        cvv: cvv
      })
    );

  this.showSuccess();
    

    this.creditcardValidation.reset();
  }

  creditcardValidation = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(7)]),
    cardnumber: new FormControl('', [
      Validators.required,
      Validators.minLength(16)
    ]),
    expire: new FormControl('', [Validators.required]),
    cvv: new FormControl('', [Validators.required, Validators.minLength(3)]),
    amount: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {}

 
}
