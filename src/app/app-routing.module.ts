import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditCardDTOComponent } from './credit-card-dto/credit-card-dto.component';
import { ReadCredicardComponent } from './pages/read-credicard/read-credicard.component';
import { AddCredicardComponent } from './pages/add-credicard/add-credicard.component';

const routes: Routes = [
  { path: 'make-payment', component: CreditCardDTOComponent },
  // {path:'read-creditcard',component: ReadCredicardComponent},
  { path: 'add-creditcard', component: AddCredicardComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
