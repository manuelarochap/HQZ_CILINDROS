import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product/product.service';
import { AccountService } from '../services/account/account.service';
import { Product } from '../interfaces/Product';
import { CommonModule, NgIf, NgFor, DecimalPipe, SlicePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIf, NgFor, DecimalPipe, SlicePipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchTerm: string = '';
  currentUserRole: string | null = null;
  isLoggedIn: boolean = false;

  private authStatusSub: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    public router: Router
  ) { }

  ngOnInit(): void {

    this.isLoggedIn = this.accountService.isLoggedIn();
    this.currentUserRole = this.accountService.getCurrentAccountRole();


    console.log('ProductListComponent: Status inicial de autenticação:');
    console.log('  Logado:', this.isLoggedIn);
    console.log('  Papel do usuário:', this.currentUserRole);
    console.log('  É comprador logado (método):', this.isCompradorLoggedIn());
    console.log('  Tem permissão de gerenciamento (método):', this.hasManagementPermission());

    this.authStatusSub = this.accountService.getAuthStatusListener().subscribe(
      ({ isLoggedIn, role }) => {
        this.isLoggedIn = isLoggedIn;
        this.currentUserRole = role;

        console.log('ProductListComponent: Status de autenticação ATUALIZADO:');
        console.log('  Logado:', this.isLoggedIn);
        console.log('  Papel do usuário:', this.currentUserRole);
        console.log('  É comprador logado (método):', this.isCompradorLoggedIn());
        console.log('  Tem permissão de gerenciamento (método):', this.hasManagementPermission());
      }
    );

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        console.log('Produtos carregados com sucesso:', this.products);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.error = 'Não foi possível carregar os produtos.';
        this.loading = false;
      }
    });
  }

  deleteProduct(id: string | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          console.log('Produto excluído com sucesso!');
        },
        error: (err) => {
          console.error(`Erro ao excluir produto com ID ${id}:`, err);
          this.error = 'Erro ao excluir o produto.';
        }
      });
    }
  }

  onSearch(): void {
    this.loading = true;
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        console.log('Produtos encontrados:', this.products);
      },
      error: (err) => {
        console.error('Erro ao pesquisar produtos:', err);
        this.error = 'Erro ao realizar a pesquisa de produtos.';
        this.loading = false;
      }
    });
  }

  hasManagementPermission(): boolean {
    return this.currentUserRole === 'vendedor' || this.currentUserRole === 'admin';
  }

  isCompradorLoggedIn(): boolean {
    return this.isLoggedIn && this.currentUserRole === 'comprador';
  }

  logout(): void {
  this.accountService.logout();
  this.router.navigate(['/login']);
  
}
}
