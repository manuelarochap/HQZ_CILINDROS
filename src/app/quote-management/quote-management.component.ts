import { Component, OnInit } from '@angular/core';
import { QuoteService } from '../services/quote/quote.service';
import { AccountService } from '../services/account/account.service';
import { Quote } from '../interfaces/quote';
import { CommonModule, NgIf, NgFor, DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quote-management',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgFor, DatePipe, TitleCasePipe, DecimalPipe, FormsModule],
  templateUrl: './quote-management.component.html',
  styleUrls: ['./quote-management.component.css']
})
export class QuoteManagementComponent implements OnInit {
  quotes: Quote[] = [];
  loading: boolean = true;
  error: string | null = null;
  expandedQuoteIndex: number | null = null;
  currentVendorId: string | null = null;
  newMessageText: string = '';

  constructor(
    private quoteService: QuoteService,
    private accountService: AccountService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.currentVendorId = this.accountService.getCurrentAccountId();
    if (!this.currentVendorId) {
      alert('Você precisa estar logado como vendedor ou admin para gerenciar orçamentos.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadQuotes();
  }

  loadQuotes(): void {
    this.loading = true;
    this.quoteService.getQuotes().subscribe({
      next: (data) => {
        this.quotes = data.sort((a, b) => {
          const statusOrder = { 'pendente': 1, 'negociando': 2, 'proposta enviada': 3, 'aprovado': 4, 'recusado': 5, 'cancelado': 6 };
          const statusCompare = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
          if (statusCompare !== 0) return statusCompare;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        this.loading = false;
        console.log('Orçamentos carregados:', this.quotes);
      },
      error: (err) => {
        console.error('Erro ao carregar orçamentos:', err);
        this.error = 'Não foi possível carregar as solicitações de orçamento.';
        this.loading = false;
      }
    });
  }

  toggleQuoteDetails(index: number): void {
    this.expandedQuoteIndex = this.expandedQuoteIndex === index ? null : index;
    this.newMessageText = '';
  }

  submitProposal(quote: Quote): void {
    if (!quote.proposedPrice || quote.proposedPrice <= 0 || !quote.deliveryDays || quote.deliveryDays <= 0 || !quote.proposalValidityDays || quote.proposalValidityDays <= 0) {
      alert('Por favor, preencha Preço Proposto, Prazo de Entrega e Validade da Proposta.');
      return;
    }

    quote.status = 'proposta enviada';

    if (this.currentVendorId && quote.vendorMessage) {
        quote.history = quote.history || [];
        quote.history.push({
            senderId: this.currentVendorId,
            senderRole: 'vendedor',
            message: `Proposta enviada: Preço R$${quote.proposedPrice!.toFixed(2)}, Entrega ${quote.deliveryDays} dias, Validade ${quote.proposalValidityDays} dias. Mensagem: ${quote.vendorMessage}`,
            timestamp: new Date().toISOString()
        });
    }

    this.quoteService.updateQuote(quote).subscribe({
      next: (updatedQuote) => {
        console.log('Proposta enviada/atualizada com sucesso:', updatedQuote);
        alert('Proposta enviada com sucesso!');
        this.loadQuotes();
      },
      error: (err) => {
        console.error('Erro ao enviar proposta:', err);
        alert('Erro ao enviar proposta. Tente novamente.');
      }
    });
  }

  updateQuoteStatus(quote: Quote, newStatus: Quote['status']): void {
    if (confirm(`Tem certeza que deseja mudar o status para "${newStatus}"?`)) {
      quote.status = newStatus;
      this.quoteService.updateQuote(quote).subscribe({
        next: (updatedQuote) => {
          console.log(`Status do orçamento ${quote.id} atualizado para ${newStatus}:`, updatedQuote);
          alert(`Status atualizado para "${newStatus}"!`);
          this.loadQuotes();
        },
        error: (err) => {
          console.error(`Erro ao atualizar status para ${newStatus}:`, err);
          alert('Erro ao atualizar status. Tente novamente.');
        }
      });
    }
  }

  sendMessage(quote: Quote, message: string): void {
    if (!message.trim()) {
      alert('A mensagem não pode estar vazia.');
      return;
    }
    if (!this.currentVendorId) {
      alert('Erro: ID do vendedor não disponível.');
      return;
    }

    if (quote.status === 'proposta enviada' || quote.status === 'aprovado' || quote.status === 'recusado') {
        quote.status = 'negociando';
    }

    this.quoteService.addMessageToQuoteHistory(quote.id!, this.currentVendorId, 'vendedor', message).subscribe({
      next: (updatedQuote) => {
        console.log('Mensagem enviada:', updatedQuote);
        this.newMessageText = '';
        alert('Mensagem enviada com sucesso!');
        this.loadQuotes(); 
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
        alert('Erro ao enviar mensagem.');
      }
    });
  }
}
