import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSchoolStudentComponent } from './add-school-student.component';

describe('AddSchoolStudentComponent', () => {
  let component: AddSchoolStudentComponent;
  let fixture: ComponentFixture<AddSchoolStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSchoolStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSchoolStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
