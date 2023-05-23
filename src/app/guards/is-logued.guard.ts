import { CanActivateFn, Router } from '@angular/router';
import { stat } from 'fs';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import jwt_decode from 'jwt-decode';

export const isLoguedGuard: CanActivateFn = (route, state) => {

  //const url = state.url;

  const authService = inject(AuthService);
  const router = inject(Router);


  if (authService.isLogued()){
    return true;
  }
  // let token = localStorage.getItem('token');
  // if (token != null) {
  //   let jwt: any;
  //   jwt = jwt_decode(token);

  //   let fechaExpira = new Date(jwt.exp * 1000);
  //   let currentDate = new Date();

  //   if (fechaExpira  > currentDate) return true;
  // }



  router.navigateByUrl('/login');
  return false;
};
