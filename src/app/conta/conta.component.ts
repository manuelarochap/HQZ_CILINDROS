import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from './../services/account/account.service';
import { Account } from '../interfaces/account';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.scss'
})
export class ContaComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });

  }

  addAccount(): void {
    if (this.registerForm.valid) {
      const newAccount: Account = {
        id: Math.floor(Math.random() * 1000000000).toString(),
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        role: this.registerForm.value.role
      };

      this.accountService.addAccount(newAccount).subscribe({
        next: (account) => {
          console.log('Conta cadastrada com sucesso:', account);
          this.registerForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar conta:', error);
        }
      });
    } else {
      this.markAllFormFieldsAsTouched(this.registerForm);
      console.log('Formulário inválido. Verifique os campos.');
    }
  }

  private markAllFormFieldsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markAllFormFieldsAsTouched(control);
      }
    });
  }

  get name() { return this.registerForm.get('name'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
}
