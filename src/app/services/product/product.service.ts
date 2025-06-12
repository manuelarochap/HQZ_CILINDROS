import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/Product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  /**
   * @returns
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Obtém um único produto pelo seu ID.
   * IMPORTANTE: Usa crases (`) para interpolação de string.
   * @param id O ID do produto a ser obtido.
   * @returns Um Observable que emite o produto encontrado.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Adiciona um novo produto à API.
   * @param product O objeto produto a ser adicionado.
   * @returns Um Observable que emite o produto recém-adicionado.
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Atualiza um produto existente na API.
   * IMPORTANTE: Usa crases (`) para interpolação de string.
   * @param product O objeto produto com as informações atualizadas.
   * @returns Um Observable que emite o produto atualizado.
   */
  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  /**
   * Exclui um produto da API pelo seu ID.
   * IMPORTANTE: Usa crases (`) para interpolação de string.
   * @param id O ID do produto a ser excluído.
   * @returns Um Observable que emite void após a exclusão.
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Pesquisa produtos por um termo de busca no nome ou descrição.
   * Reutiliza getProducts() se a query estiver vazia.
   * @param query O termo de busca.
   * @returns Um Observable que emite uma array de produtos que correspondem à busca.
   */
  searchProducts(query: string): Observable<Product[]> {
    if (!query.trim()) {
      return this.getProducts();
    }


    return this.http.get<Product[]>(`${this.apiUrl}?q=${query}`).pipe(
      map(products => products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }
}
