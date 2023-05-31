import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (route, state) => {


  const authService = inject( AuthService );


  if (!authService.isAdmin()){
    return false;
  }
  return true;
};
