import { UniversityService } from './../../../services/university/university.service';
import { SchoolService } from './../../../services/school/school.service';
import { SchoolStudentService } from './../../../services/school-student/school-student.service';
import { Student } from './../../../interfaces/student';
import { Component } from '@angular/core';
import { SchoolStudent } from '../../../interfaces/school-student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';
import { School } from '../../../interfaces/school';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { University } from '../../../interfaces/university';

@Component({
  selector: 'app-add-school-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-school-student.component.html',
  styleUrl: './add-school-student.component.css'
})
export class AddSchoolStudentComponent {
  students: Student[] = [];
  schools: School[] = [];
  schoolStudents: SchoolStudent[] = []
  universities: University[] = [];
  newSchoolStudent: SchoolStudent = {
    id: "",
    school_id: "",
    student_id: "",
    // grades: {grades: []},
    fos: ""
  };

  constructor(private route: ActivatedRoute,
    private schoolStudentService: SchoolStudentService,
    private studentService: StudentService,
    private schoolService: SchoolService,
    private universityService: UniversityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSchoolStudents();
    this.loadSchool();
    this.loadStudents();
    this.loadUniversities();
  }

  loadSchoolStudents(): void {
    this.schoolStudentService.getSchoolStudents().subscribe((schoolStudents) => {
      this.schoolStudents = schoolStudents;
    });
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe((students) => {
      this.students = students;
    });
  }

  loadSchool(): void {
    this.schoolService.getSchools().subscribe((schools) => {
      this.schools = schools;
    });
  }

  loadUniversities(): void {
    this.universityService.getUniversities().subscribe(
      (data) => {
        this.universities = data;
      },
      (error) => {
        console.error('Error fetching universities', error);
      }
    );
  }

  addSchoolStudent(): void {
    this.newSchoolStudent.id = Math.floor(Math.random() * 1000000000).toString();
    this.schoolStudentService.addSchoolStudent(this.newSchoolStudent).subscribe((schoolStudent) => {
      this.schoolStudents.push(schoolStudent);
      this.newSchoolStudent = {
        id: "",
        school_id: "",
        student_id: "",
        // grades: {grades: []},
        fos: ""
      };
    });

    this.router.navigate(['/usr/grades'])
  }
}
