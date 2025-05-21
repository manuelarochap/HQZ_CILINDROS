import { StudentService } from './../../../services/student/student.service';
import { Component, OnInit } from '@angular/core';
import { Student } from '../../../interfaces/student';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-student.component.html',
  styleUrl: './edit-student.component.css'
})
export class EditStudentComponent implements OnInit {
  students: Student[] = [];
  student: Student | undefined

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.studentService.getStudentById(+studentId).subscribe(
        (student) => {
          this.student = student;
        },
        (error) => {
          console.error('Error loading student:', error);
        }
      );
    }
  }

  editStudent(student: Student): void {
    this.studentService.editStudent(student).subscribe((updatedStudent) => {
      const index = this.students.findIndex((s) => s.id === updatedStudent.id);
      if (index !== -1) {
        this.students[index] = updatedStudent;
      }
    });

    this.router.navigate(['/usr/registrations'])
  }

  deleteStudent(id: string): void {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.students = this.students.filter((student) => student.id !== id);
    });

    this.router.navigate(['/usr/registrations'])
  }
}
