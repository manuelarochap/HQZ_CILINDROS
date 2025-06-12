// src/app/request-quote/request-quote.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { AccountService } from '../services/account/account.service';
import { QuoteService } from '../services/quote/quote.service';
import { Product } from '../interfaces/Product';
import { Quote } from '../interfaces/quote';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './request-quote.component.html',
  styleUrls: ['./request-quote.component.css']
})
export class RequestQuoteComponent implements OnInit {
  productId: string | null = null;
  product: Product | undefined;
  loadingProduct: boolean = true;
  productError: string | null = null;

  quantity: number = 1;
  message: string = '';
  requesterEmail: string = '';
  requesterName: string = '';
  requesterAccountId: string = '';

  submissionMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private quoteService: QuoteService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    } else {
      this.productError = 'ID do produto não fornecido para a solicitação de orçamento.';
      this.loadingProduct = false;
    }

    const currentAccountString = localStorage.getItem('currentAccount');
    if (currentAccountString) {
      const currentAccount = JSON.parse(currentAccountString);
      this.requesterEmail = currentAccount.email;
      this.requesterAccountId = currentAccount.id;
    } else {
      this.router.navigate(['/login']); 
    }
  }

  loadProductDetails(id: string): void {
    this.loadingProduct = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loadingProduct = false;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do produto para orçamento:', err);
        this.productError = 'Não foi possível carregar os detalhes do produto para orçamento.';
        this.loadingProduct = false;
      }
    });
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
      productId: this.productId!,
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
        setTimeout(() => {
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
