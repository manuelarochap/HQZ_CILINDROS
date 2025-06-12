import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuotesComponent } from './user-quotes.component';

describe('UserQuotesComponent', () => {
  let component: UserQuotesComponent;
  let fixture: ComponentFixture<UserQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQuotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
