import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Redirects the root path to the appropriate home page based on the user's role.
 * - ADMIN → /products
 * - USER  → /shop
 * - Unauthenticated → /login
 */
export const homeGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.hasRole('ADMIN')) {
    return router.createUrlTree(['/products']);
  }

  return router.createUrlTree(['/shop']);
};
