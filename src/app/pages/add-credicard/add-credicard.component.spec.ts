import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCredicardComponent } from './add-credicard.component';

describe('AddCredicardComponent', () => {
  let component: AddCredicardComponent;
  let fixture: ComponentFixture<AddCredicardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCredicardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCredicardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
