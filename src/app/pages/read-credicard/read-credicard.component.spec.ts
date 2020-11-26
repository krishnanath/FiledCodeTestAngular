import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCredicardComponent } from './read-credicard.component';

describe('ReadCredicardComponent', () => {
  let component: ReadCredicardComponent;
  let fixture: ComponentFixture<ReadCredicardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadCredicardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCredicardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
