import { SchoolStudentService } from './../../services/school-student/school-student.service';
import { Component, OnInit } from '@angular/core';
import { SchoolStudent } from '../../interfaces/school-student';
import { CommonModule } from '@angular/common';
import { School } from '../../interfaces/school';
import { Student } from '../../interfaces/student';
import { StudentService } from '../../services/student/student.service';
import { SchoolService } from '../../services/school/school.service';

@Component({
  selector: 'app-grades-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grades-table.component.html',
  styleUrl: './grades-table.component.css'
})
export class GradesTableComponent implements OnInit{
  protected schoolStudents: SchoolStudent[] = []
  protected schools: School[] = []
  protected students: Student[] = []

  constructor(private schoolStudentService: SchoolStudentService,
              private studentService: StudentService,
              private schoolService: SchoolService
  ) {}

  ngOnInit(): void {
    this.loadSchoolStudents();
    this.loadSchool();
    this.loadStudents();
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
  // ngOnInit(): void {
  //   this.students = this.schoolStudentService.getSchoolStudents()
  // }

//   getTotalGrades(cpf: string) {
//     return this.schoolStudentService.getTotalGrades(cpf)
//   }
}
