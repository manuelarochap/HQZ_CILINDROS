import { AccountService } from './../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Account } from '../interfaces/account';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.scss'
})
export class ContaComponent implements OnInit{
  protected accounts: Account[] = []
  protected newAccount: Account = { id: "", name: "", email: "", password: ""}
  constructor(
    private active: ActivatedRoute,
    private accountService: AccountService,
    private router: Router) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    })
  }

  addAccount(): void {
    this.newAccount.id = Math.floor(Math.random() * 1000000000).toString();
    this.accountService.addAccount(this.newAccount).subscribe((account) => {
      this.accounts.push(account);
      this.newAccount = { id: "", name: "", email: "", password: ""};
    });

    this.router.navigate(['/']);
  }
}
