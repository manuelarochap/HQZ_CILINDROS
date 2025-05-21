import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url = 'http://localhost:3000/accounts';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url)
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.url}/${id}`)
  }

  getAccountByEmail(email: string): Observable<Account> {
    return this.http.get<Account>(`${this.url}/search?country=${email}`)
  }

  addAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.url, account, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    });
  }
}
