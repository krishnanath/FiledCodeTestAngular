import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardDTOComponent } from './credit-card-dto.component';

describe('CreditCardDTOComponent', () => {
  let component: CreditCardDTOComponent;
  let fixture: ComponentFixture<CreditCardDTOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditCardDTOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardDTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
