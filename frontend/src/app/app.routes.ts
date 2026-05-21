import { Routes } from '@angular/router';
import { ProductListComponent } from './products/pages/product-list/product-list.component';
import { SellComponent } from './sales/pages/sell/sell.component';
import { ShopComponent } from './shop/pages/shop/shop.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { MyOrdersComponent } from './sales/pages/my-orders/my-orders.component';
import { PurchaseHistoryComponent } from './inventory/pages/purchase-history/purchase-history.component';
import { authGuard } from './core/guards/auth.guard';
import { homeGuard } from './core/guards/home.guard';

export const routes: Routes = [
  // Root redirect — role-aware
  { path: '', canActivate: [homeGuard], component: LoginComponent },

  // Public auth routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Normal user (USER role) only
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [authGuard],
    data: { roles: ['USER'] }
  },

  // Admin (ADMIN role) only
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'sell',
    component: SellComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'purchase-history',
    component: PurchaseHistoryComponent,
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },

  // Both roles
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [authGuard],
    data: { roles: ['USER'] }
  },

  // Fallback — role-aware redirect
  { path: '**', canActivate: [homeGuard], component: LoginComponent }
];
