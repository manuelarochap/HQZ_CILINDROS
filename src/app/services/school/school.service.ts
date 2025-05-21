import { Injectable } from '@angular/core';
import { School } from '../../interfaces/school';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  url = 'http://localhost:3000/schools';

  constructor(private http: HttpClient) {}

  getSchools(): Observable<School[]> {
    return this.http.get<School[]>(this.url);
  }

  getSchoolById(id: number): Observable<School> {
    return this.http.get<School>(`${this.url}/${id}`);
  }

  addSchool(school: School): Observable<School> {
    return this.http.post<School>(this.url, school, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  editSchool(school: School): Observable<School> {
    return this.http.put<School>(`${this.url}/${school.id}`, school, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  deleteSchool(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
