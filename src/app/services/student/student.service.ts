import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs';
import { Student } from '../../interfaces/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  url = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.url}/${id}`);
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url, student, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  editStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.url}/${student.id}`, student, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // private students: Student[] = [
  //   {
  //     id: Math.floor(Math.random() * 1000000000).toString(),
  //     cpf: Math.floor(Math.random() * (100000000000 - 10000000000) + 10000000000).toString(),
  //     name: "Rodrigo",
  //     address: "Às Pampa",
  //     dateOfBirth: new Date()
  //   },
  //   {
  //     id: Math.floor(Math.random() * 1000000000).toString(),
  //     cpf: Math.floor(Math.random() * (100000000000 - 10000000000) + 10000000000).toString(),
  //     name: "Tayla",
  //     address: "Aquele Lá",
  //     dateOfBirth: new Date()
  //   }
  // ]

  // createStudent() {
  //   return {
  //     id: Math.floor(Math.random() * 1000000000).toString(),
  //     cpf: "",
  //     name: "",
  //     address: "",
  //     dateOfBirth: new Date()
  //   }
  // }

  // addStudent(student: Student) {
  //   this.students.push(student)
  // }

  // getStudents() {
  //   return this.students
  // }
  // async getStudents(): Promise<Student[]> {
  //   const data = await fetch(this.url);
  //   return await data.json() ?? [];
  // }

  // async getStudentsById(id: number): Promise<Student | undefined> {
  //   const data = await fetch(`${this.url}/${id}`);
  //   return await data.json() ?? {};
  // }


  // editStudent(student: Student) {
  //   const index = this.students.findIndex(x => x.id === student.id)
  //   this.students[index] = student
  // }

  // deleteStudent(student: Student) {
  //   this.students = this.students.filter((x) => x.id !== student.id)
  // }
}
