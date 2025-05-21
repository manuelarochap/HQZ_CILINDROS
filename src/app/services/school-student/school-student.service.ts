import { Injectable } from '@angular/core';
import { SchoolStudent } from '../../interfaces/school-student';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolStudentService {
  url = 'http://localhost:3000/school-student';
  constructor(private http: HttpClient) {}

  getSchoolStudents(): Observable<SchoolStudent[]> {
    return this.http.get<SchoolStudent[]>(this.url);
  }

  getSchoolStudentById(id: number): Observable<SchoolStudent> {
    return this.http.get<SchoolStudent>(`${this.url}/${id}`)
  }

  addSchoolStudent(schoolStudent: SchoolStudent): Observable<SchoolStudent> {
    return this.http.post<SchoolStudent>(this.url, schoolStudent, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }
}
