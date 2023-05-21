import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const loguedGuard: CanActivateFn = (route, state) => {

  const authService = inject( AuthService );
  const router = inject( Router );


  if (authService.isLogued()){
    router.navigateByUrl('/solicitudes');
  }
  
  return true;
};
