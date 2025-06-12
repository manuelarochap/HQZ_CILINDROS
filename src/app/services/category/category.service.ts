// src/app/services/category/category.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../interfaces/category';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/categories'; 

  constructor(private http: HttpClient) { }

  // GET: Obter todas as categorias
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // GET: Obter uma categoria por ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);
  }

  // POST: Adicionar uma nova categoria
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // PUT: Atualizar uma categoria existente
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`<span class="math-inline">\{this\.apiUrl\}/</span>{category.id}`, category, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // DELETE: Excluir uma categoria
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`<span class="math-inline">\{this\.apiUrl\}/</span>{id}`);
  }
}
