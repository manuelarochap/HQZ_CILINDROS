import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Account } from '../../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  url = 'http://localhost:3000/accounts';
  private authStatusListener = new Subject<{ isLoggedIn: boolean, role: string | null }>();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  getAuthStatusListener(): Observable<{ isLoggedIn: boolean, role: string | null }> {
    return this.authStatusListener.asObservable();
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.url).pipe(
      catchError(this.handleError<Account[]>('getAccounts', []))
    );
  }

  getAccountById(id: string): Observable<Account | undefined> {
    return this.http.get<Account[]>(`${this.url}?id=${id}`).pipe(
      map(accounts => accounts.length > 0 ? accounts[0] : undefined),
      catchError(this.handleError<Account | undefined>(`getAccountById id=${id}`, undefined))
    );
  }

  getAccountByEmail(email: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.url}?email=${email}`).pipe(
      catchError(this.handleError<Account[]>('getAccountByEmail', []))
    );
  }

  addAccount(account: Account): Observable<Account> {
    const accountToRegister = { ...account, role: account.role || 'comprador' };
    return this.http.post<Account>(this.url, accountToRegister, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }).pipe(
      catchError(this.handleError<Account>('addAccount'))
    );
  }

  login(email: string, password: string): Observable<Account | null> {
    return this.http.get<Account[]>(`${this.url}?email=${email}&password=${password}`).pipe(
      map((accounts: Account[]) => {
        if (accounts && accounts.length > 0) {
          const account = accounts[0];
          localStorage.setItem('currentAccount', JSON.stringify(account));
          localStorage.setItem('currentAccountId', account.id || '');
          localStorage.setItem('currentAccountRole', account.role || 'comprador');
          console.log('AccountService: Role armazenado no localStorage:', localStorage.getItem('currentAccountRole'));
          this.authStatusListener.next({ isLoggedIn: true, role: account.role || 'comprador' });
          return account;
        }
        this.authStatusListener.next({ isLoggedIn: false, role: null });
        return null;
      }),
      catchError(error => {
        this.authStatusListener.next({ isLoggedIn: false, role: null });
        return this.handleError<Account | null>('login', null)(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentAccount');
    localStorage.removeItem('currentAccountId');
    localStorage.removeItem('currentAccountRole');
    this.authStatusListener.next({ isLoggedIn: false, role: null });
    console.log('Logout realizado.');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentAccount');
  }

  getCurrentAccountRole(): string | null {
    const role = localStorage.getItem('currentAccountRole');
    return role;
  }

  getCurrentAccountId(): string | null {
    const accountId = localStorage.getItem('currentAccountId');
    return accountId;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`Erro na operação ${operation}:`, error);
      return of(result as T);
    };
  }
}
