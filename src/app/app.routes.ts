import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ContaComponent } from './conta/conta.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RequestQuoteComponent } from './request-quote/request-quote.component';
import { QuoteManagementComponent } from './quote-management/quote-management.component';
import { UserQuotesComponent } from './user-quotes/user-quotes.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: ContaComponent },
  { path: '', component: LandingPageComponent },
  { path: 'products', component: ProductListComponent},
  { path: 'products/add', component: ProductFormComponent},
  { path: 'products/edit/:id', component: ProductFormComponent},
  { path: 'products/:id', component: ProductDetailComponent},
  { path: 'request-quote/:id', component: RequestQuoteComponent},
  { path: 'manage-quotes', component: QuoteManagementComponent},
  { path: 'user-quotes', component: UserQuotesComponent},
  { path: 'quote-management', component: QuoteManagementComponent},

];
