import { ListaProdutosComponent } from './produto/lista-produtos/lista-produtos.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GradesTableComponent } from './sidebar/grades-table/grades-table.component';
import { DashboardComponent } from './sidebar/dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ContaComponent } from './conta/conta.component';

export const routes: Routes = [

  { path: 'usr', component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      // {
      //   path: 'dashboard', component: DashboardComponent,
      //   children: [
      //     { path: '1', component: StudentFormComponent },
      //     { path: '2', component: SchoolFormComponent },
      //   ],
      // },
    { path: 'grades', component: GradesTableComponent },
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: ContaComponent },
  { path: '', component: LandingPageComponent },
  { path: 'produtos', component: ListaProdutosComponent }
];
