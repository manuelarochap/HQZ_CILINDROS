import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { QuoteService } from '../services/quote/quote.service';
import { AccountService } from '../services/account/account.service';
import { Quote } from '../interfaces/quote';
import { CommonModule, NgIf, NgFor, DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common'; // Adicione DecimalPipe
import { FormsModule } from '@angular/forms'; // Importe FormsModule para ngModel

@Component({
  selector: 'app-user-quotes',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, NgFor, DatePipe, TitleCasePipe, DecimalPipe, FormsModule], // Adicione FormsModule
  templateUrl: './user-quotes.component.html',
  styleUrls: ['./user-quotes.component.css']
})
export class UserQuotesComponent implements OnInit {
  userQuotes: Quote[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentAccountId: string | null = null;
  currentUserRole: string | null = null; // Para sendMessage
  expandedQuoteIndex: number | null = null;
  newMessageText: string = ''; // Para a nova mensagem no histórico

  constructor(
    private quoteService: QuoteService,
    private accountService: AccountService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.currentAccountId = this.accountService.getCurrentAccountId();
    this.currentUserRole = this.accountService.getCurrentAccountRole();

    if (!this.currentAccountId || this.currentUserRole !== 'comprador') {
      alert('Você precisa estar logado como comprador para ver suas propostas de orçamento.');
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserQuotes(this.currentAccountId);
  }

  loadUserQuotes(accountId: string): void {
    this.loading = true;
    this.quoteService.getQuotesByAccountId(accountId).subscribe({
      next: (data) => {
        // Ordena para mostrar os mais recentes primeiro, e propostas ativas no topo
        this.userQuotes = data.sort((a, b) => {
          // Prioriza status "pendente", "proposta enviada", "negociando"
          const statusOrder = { 'pendente': 1, 'proposta enviada': 2, 'negociando': 3, 'aprovado': 4, 'recusado': 5, 'cancelado': 6 };
          const statusCompare = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
          if (statusCompare !== 0) return statusCompare;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        this.loading = false;
        console.log('Histórico de propostas do usuário carregado:', this.userQuotes);
      },
      error: (err) => {
        console.error('Erro ao carregar histórico de propostas:', err);
        this.error = 'Não foi possível carregar seu histórico de propostas.';
        this.loading = false;
      }
    });
  }

  toggleQuoteDetails(index: number): void {
    this.expandedQuoteIndex = this.expandedQuoteIndex === index ? null : index;
    this.newMessageText = ''; // Limpa o campo de mensagem ao expandir/contrair
  }

  updateQuoteStatus(quote: Quote, newStatus: Quote['status']): void {
    if (confirm(`Tem certeza que deseja mudar o status desta proposta para "${newStatus}"?`)) {
      if (this.currentAccountId && this.currentUserRole) {
          quote.history = quote.history || [];
          const statusMessage = newStatus === 'aprovado' ? 'Proposta aprovada pelo comprador.' : 'Proposta recusada pelo comprador.';
          quote.history.push({
              senderId: this.currentAccountId,
              senderRole: this.currentUserRole as "comprador",
              message: statusMessage,
              timestamp: new Date().toISOString()
          });
      }
      quote.status = newStatus;
      this.quoteService.updateQuote(quote).subscribe({
        next: (updatedQuote) => {
          console.log(`Status da proposta ${quote.id} atualizado para ${newStatus}:`, updatedQuote);
          alert(`Proposta ${newStatus === 'aprovado' ? 'aprovada' : 'recusada'} com sucesso!`);
          this.loadUserQuotes(this.currentAccountId!);
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
    if (!this.currentAccountId || !this.currentUserRole) {
      alert('Erro: Dados do comprador não disponíveis.');
      return;
    }

    if (quote.status === 'proposta enviada' || quote.status === 'aprovado' || quote.status === 'recusado') {
        quote.status = 'negociando';
    }


    this.quoteService.addMessageToQuoteHistory(quote.id!, this.currentAccountId, this.currentUserRole as "comprador", message).subscribe({
      next: (updatedQuote) => {
        console.log('Mensagem enviada:', updatedQuote);
        this.newMessageText = '';
        alert('Mensagem enviada com sucesso!');
        this.loadUserQuotes(this.currentAccountId!);
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
        alert('Erro ao enviar mensagem.');
      }
    });
  }
}
