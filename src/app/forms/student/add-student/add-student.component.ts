import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../interfaces/student';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../services/student/student.service';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent {
  students: Student[] = [];
  newStudent: Student = { id: "", cpf: '', name: '', address: '', dateOfBirth: new Date() };

  constructor(private route: ActivatedRoute, private studentService: StudentService, private router: Router){}

  addStudent(): void {
    this.newStudent.id = Math.floor(Math.random() * 1000000000).toString();
    this.studentService.addStudent(this.newStudent).subscribe((student) => {
      this.students.push(student);
      this.newStudent = { id: "", cpf: '', name: '', address: '', dateOfBirth: new Date() };
    });

    this.router.navigate(['/usr/registrations'])
  }
}
