import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Creditcard } from 'src/models/creditcard.model';
import { Appstate } from 'src/app.state';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-read-credicard',
  templateUrl: './read-credicard.component.html',
  styleUrls: ['./read-credicard.component.scss']
})
export class ReadCredicardComponent implements OnInit {

  creditcard: Observable<Creditcard[]>;

  constructor(private store: Store<Appstate>) { 
    this.creditcard = store.select('creditcard')

  }
  // delTutorial(index) {
  //   this.store.dispatch(new CreditcardActions.RemoveCreditcard(index))
  // }

  ngOnInit(): void {
  }

}
