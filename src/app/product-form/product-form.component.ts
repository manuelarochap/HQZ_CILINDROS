// src/app/product-form/product-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product/product.service';
import { CategoryService } from '../services/category/category.service';
import { Product } from '../interfaces/Product';
import { Category } from '../interfaces/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {

  productForm!: FormGroup;
  productId: string | null = null;
  isEditMode: boolean = false;
  categories: Category[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      imageUrl: ['']
    });

    this.loadCategories();

    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loadProductForEdit(this.productId);
      } else {
        this.isEditMode = false;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.error = 'Não foi possível carregar as categorias.';
      }
    });
  }

  loadProductForEdit(id: string): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto para edição:', err);
        this.error = 'Produto não encontrado ou erro ao carregar.';
        this.loading = false;
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;

      if (this.isEditMode && this.productId) {
        this.productService.updateProduct(product).subscribe({
          next: () => {
            console.log('Produto atualizado com sucesso!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Erro ao atualizar produto:', err);
            this.error = 'Erro ao atualizar produto. Verifique os dados.';
          }
        });
      } else {
        product.id = Math.floor(Math.random() * 1000000000).toString();

        this.productService.addProduct(product).subscribe({
          next: () => {
            console.log('Produto adicionado com sucesso!');
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Erro ao adicionar produto:', err);
            this.error = 'Erro ao adicionar produto. Verifique os dados.';
          }
        });
      }
    } else {
      console.log('Formulário inválido. Por favor, preencha todos os campos obrigatórios.');
      this.error = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      this.markAllFormFieldsAsTouched(this.productForm);
    }
  }

  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stock() { return this.productForm.get('stock'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

  private markAllFormFieldsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllFormFieldsAsTouched(control);
      }
    });
  }
}
