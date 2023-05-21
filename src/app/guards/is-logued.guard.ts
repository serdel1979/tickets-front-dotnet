import { CanActivateFn, Router } from '@angular/router';
import { stat } from 'fs';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const isLoguedGuard: CanActivateFn = (route, state) => {

  //const url = state.url;

  const authService = inject( AuthService );
  const router = inject( Router );

  console.log(route, state);

  if (authService.isLogued()){
    return true;
  }
  router.navigateByUrl('/login');
  return false;
};
