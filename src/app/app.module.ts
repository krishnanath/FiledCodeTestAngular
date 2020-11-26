import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreditCardDTOComponent } from './credit-card-dto/credit-card-dto.component';
import { InteractivePaycardModule } from 'ngx-interactive-paycard';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/creditcard.reducers';
import { AddCredicardComponent } from './pages/add-credicard/add-credicard.component';
import { ReadCredicardComponent } from './pages/read-credicard/read-credicard.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxCleaveDirectiveModule } from 'ngx-cleave-directive';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr'; 
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { from } from 'rxjs';
import { timeout } from 'q';

@NgModule({
  declarations: [
    AppComponent,
    CreditCardDTOComponent,
    AddCredicardComponent,
    ReadCredicardComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxCleaveDirectiveModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass:'toast-top-right',
      preventDuplicates:false
    }),
 
    StoreModule.forRoot({
      creditcard: reducer
    }),
    AppRoutingModule,
    InteractivePaycardModule,

 
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
