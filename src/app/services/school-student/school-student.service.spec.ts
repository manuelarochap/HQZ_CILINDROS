import { TestBed } from '@angular/core/testing';

import { SchoolStudentService } from './school-student.service';

describe('SchoolStudentService', () => {
  let service: SchoolStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
