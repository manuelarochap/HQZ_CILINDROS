// lista-produtos.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaProdutosComponent } from './lista-produtos.component';
import { ProdutoService } from '../../services/produto/produto.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ListaProdutosComponent', () => {
  let component: ListaProdutosComponent;
  let fixture: ComponentFixture<ListaProdutosComponent>;

  const mockProdutoService = {
    listar: () => of([
      { id: 1, nome: 'Produto A' },
      { id: 2, nome: 'Produto B' }
    ])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaProdutosComponent],
      providers: [
        { provide: ProdutoService, useValue: mockProdutoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve exibir a lista de produtos', () => {
    const itens = fixture.debugElement.queryAll(By.css('li'));
    expect(itens.length).toBe(2);
    expect(itens[0].nativeElement.textContent).toContain('Produto A');
    expect(itens[1].nativeElement.textContent).toContain('Produto B');
  });
});
