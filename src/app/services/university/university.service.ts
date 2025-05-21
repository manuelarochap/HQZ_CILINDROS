import { University } from './../../interfaces/university';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private apiUrl = 'http://universities.hipolabs.com/search?country=brazil';

  constructor(private http: HttpClient) { }

  // Method to get universities
  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.apiUrl);
  }
}
