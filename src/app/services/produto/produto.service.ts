import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor() { }

  getProdutos(): Observable<any[]> {

    const produtosMock = [
  { nome: 'Válvula Solenoide', descricao: 'Controla automaticamente o fluxo de ar em sistemas pneumáticos.', preco: 120.5 },
  { nome: 'Atuador Pneumático', descricao: 'Converte energia do ar comprimido em movimento mecânico.', preco: 340 },
  { nome: 'Compressor de Ar', descricao: 'Gera e armazena ar comprimido para sistemas industriais.', preco: 1450.99 },
  { nome: 'Filtro Regulador Lubrificador (FRL)', descricao: 'Filtra, regula e lubrifica o ar comprimido.', preco: 220 },
  { nome: 'Mangueira Pneumática', descricao: 'Conduz ar comprimido entre os componentes pneumáticos.', preco: 35.75 },
  { nome: 'Cilindro de Dupla Ação', descricao: 'Executa movimento nos dois sentidos com pressão de ar.', preco: 289.9 },
  { nome: 'Conector Rápido', descricao: 'Facilita conexões rápidas e seguras entre mangueiras.', preco: 18.9 },
  { nome: 'Sensor de Pressão', descricao: 'Detecta a pressão do ar no sistema e envia sinais ao controlador.', preco: 95 },
  { nome: 'Reservatório de Ar', descricao: 'Armazena ar comprimido para uso sob demanda.', preco: 480 },
  { nome: 'Válvula de Retenção', descricao: 'Permite o fluxo de ar em apenas uma direção.', preco: 40 },
  { nome: 'Unidade de Tratamento de Ar', descricao: 'Sistema completo de filtragem, regulação e lubrificação do ar.', preco: 510.25 },
  { nome: 'Controlador Pneumático', descricao: 'Realiza controle de pressão e fluxo em sistemas automáticos.', preco: 635 }
    ];
    return of(produtosMock);
  }
}
