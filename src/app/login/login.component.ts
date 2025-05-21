import { AccountService } from './../services/account/account.service';
import { AdminService } from './../services/admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Admin } from '../interfaces/admin';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Account } from '../interfaces/account';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  protected accounts: Account[] = []
  protected account: Account = {id: "", name: "", email: "", password: ""}
  protected nAccount?: Account
  username = ""
  password = ""
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    })
  }

  verification(): void {
    this.accountService.getAccountByEmail(this.account.email).subscribe((account) => {

    })
  }

  onLogin(): void {

  }
}
