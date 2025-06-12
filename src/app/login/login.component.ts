import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../services/account/account.service';
import { Account } from '../interfaces/account';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent   {


  email!: string;
  password!: string;
  loginError: string | null = null;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  onLogin(): void {
    this.loginError = null;
    if (!this.email || !this.password) {
      this.loginError = 'Por favor, preencha o email e a senha.';
      return;
    }

    this.accountService.login(this.email, this.password).subscribe({
      next: (account: Account | null) => {
        if (account) {
          console.log('Login bem-sucedido!', account);
          this.router.navigate(['/products']);
        } else {
          this.loginError = 'Email ou senha inválidos.';
          console.warn('Falha no login: Credenciais inválidas.');
        }
      },
      error: (err) => {
        console.error('Erro no serviço de login:', err);
        this.loginError = 'Ocorreu um erro ao tentar fazer login. Verifique sua conexão ou tente novamente mais tarde.';
      }
    });
  }

}
