import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError,  map, switchMap } from 'rxjs/operators';
import { Quote } from '../../interfaces/quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private apiUrl = 'http://localhost:3000/quotes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  addQuote(quote: Quote): Observable<Quote> {
    const newQuote: Quote = {
      ...quote,
      status: 'pendente',
      history: [{
        senderId: quote.requesterAccountId,
        senderRole: 'comprador',
        message: quote.message,
        timestamp: quote.timestamp
      }]
    };
    return this.http.post<Quote>(this.apiUrl, newQuote, this.httpOptions).pipe(
      catchError(this.handleError<Quote>('addQuote'))
    );
  }

  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(this.apiUrl).pipe(
      catchError(this.handleError<Quote[]>('getQuotes', []))
    );
  }

  getQuoteById(id: string): Observable<Quote | undefined> {
    return this.http.get<Quote[]>(`${this.apiUrl}?id=${id}`).pipe(
      map(quotes => quotes.length > 0 ? quotes[0] : undefined),
      catchError(this.handleError<Quote | undefined>(`getQuoteById id=${id}`, undefined))
    );
  }

  getQuotesByAccountId(accountId: string): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}?requesterAccountId=${accountId}`).pipe(
      catchError(this.handleError<Quote[]>('getQuotesByAccountId', []))
    );
  }

  updateQuote(quote: Quote): Observable<Quote> {
    return this.http.put<Quote>(`${this.apiUrl}/${quote.id}`, quote, this.httpOptions).pipe(
      catchError(this.handleError<Quote>('updateQuote'))
    );
  }

  addMessageToQuoteHistory(quoteId: string, senderId: string, senderRole: 'comprador' | 'vendedor', message: string): Observable<Quote> {
    return this.getQuoteById(quoteId).pipe(
      map(existingQuote => {
        if (existingQuote) {
          const updatedQuote: Quote = {
            ...existingQuote,
            history: existingQuote.history ? [...existingQuote.history, { senderId, senderRole, message, timestamp: new Date().toISOString() }] : [{ senderId, senderRole, message, timestamp: new Date().toISOString() }]
          };
          return updatedQuote;
        }
        throw new Error('Orçamento não encontrado para adicionar mensagem.');
      }),
      switchMap(updatedQuote => this.updateQuote(updatedQuote)),
      catchError(this.handleError<Quote>(`addMessageToQuoteHistory quoteId=${quoteId}`))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }
}
