import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { AccountService } from '../services/account/account.service';
import { QuoteService } from '../services/quote/quote.service';
import { Product } from '../interfaces/Product';
import { Account } from '../interfaces/account';
import { Quote } from '../interfaces/quote';
import { CommonModule, NgIf, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, FormsModule, DecimalPipe, TitleCasePipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  loading: boolean = true;
  error: string | null = null;
  currentUserRole: string | null = null;
  isLoggedIn: boolean = false;

  quantity: number = 1;
  message: string = '';
  requesterEmail: string = '';
  requesterName: string = '';
  requesterAccountId: string = '';
  submissionMessage: string | null = null;

  vendor: Account | undefined;
  showVendorContact: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private quoteService: QuoteService
  ) { }

  ngOnInit(): void {
    this.updateLoginStatus();

    this.accountService.getAuthStatusListener().subscribe(
      ({ isLoggedIn, role }) => {
        this.isLoggedIn = isLoggedIn;
        this.currentUserRole = role;
        if (this.isLoggedIn) {
          const currentAccountString = localStorage.getItem('currentAccount');
          if (currentAccountString) {
            const currentAccount = JSON.parse(currentAccountString);
            this.requesterEmail = currentAccount.email;
            this.requesterAccountId = currentAccount.id;
          }
        } else {
            this.requesterEmail = '';
            this.requesterAccountId = '';
        }
      }
    );

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
          console.log('Detalhes do produto carregados:', this.product);

          if (this.product && this.product.vendorId) {
            this.accountService.getAccountById(this.product.vendorId).subscribe({
              next: (vendorData) => {
                this.vendor = vendorData;
                console.log('Detalhes do vendedor carregados:', this.vendor);
              },
              error: (err) => {
                console.error('Erro ao carregar detalhes do vendedor:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do produto:', err);
          this.error = 'Não foi possível carregar os detalhes do produto.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'ID do produto não fornecido.';
      this.loading = false;
    }

    if (this.isLoggedIn) {
      const currentAccountString = localStorage.getItem('currentAccount');
      if (currentAccountString) {
        const currentAccount = JSON.parse(currentAccountString);
        this.requesterEmail = currentAccount.email;
        this.requesterAccountId = currentAccount.id;
      }
    }
  }

  updateLoginStatus(): void {
    this.isLoggedIn = this.accountService.isLoggedIn();
    this.currentUserRole = this.accountService.getCurrentAccountRole();
  }

  hasManagementPermission(): boolean {
    return this.currentUserRole === 'vendedor' || this.currentUserRole === 'admin';
  }

  isCompradorLoggedIn(): boolean {
    return this.isLoggedIn && this.currentUserRole === 'comprador';
  }

  toggleVendorContact(): void {
    this.showVendorContact = !this.showVendorContact;
  }

  deleteProduct(id: string | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Produto excluído com sucesso.');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
          alert('Erro ao excluir produto.');
        }
      });
    }
  }

  submitQuoteRequest(): void {
    if (this.quantity <= 0) {
      this.submissionMessage = 'A quantidade deve ser maior que zero.';
      return;
    }
    if (!this.requesterEmail || !this.message || !this.requesterAccountId) {
        this.submissionMessage = 'Erro: Faltam informações do solicitante. Tente fazer login novamente.';
        console.error('Dados ausentes para a solicitação de orçamento:', {
            email: this.requesterEmail, message: this.message, accountId: this.requesterAccountId
        });
        return;
    }

    const quoteRequest: Quote = {
      productId: this.product!.id!,
      productName: this.product?.name || 'Produto Desconhecido',
      quantity: this.quantity,
      message: this.message,
      requesterEmail: this.requesterEmail,
      requesterName: this.requesterName,
      requesterAccountId: this.requesterAccountId,
      timestamp: new Date().toISOString(),
      status: 'pendente'
    };

    this.quoteService.addQuote(quoteRequest).subscribe({
      next: (response) => {
        console.log('Solicitação de Orçamento Enviada com sucesso:', response);
        this.submissionMessage = 'Sua solicitação de orçamento foi enviada com sucesso! Aguarde o contato do vendedor.';
        this.quantity = 1;
        this.message = '';
        setTimeout(() => {
          this.submissionMessage = null;
          this.router.navigate(['/products']);
        }, 3000);
      },
      error: (err) => {
        console.error('Erro ao enviar solicitação de orçamento:', err);
        this.submissionMessage = 'Ocorreu um erro ao enviar sua solicitação. Tente novamente mais tarde.';
      }
    });
  }
}
