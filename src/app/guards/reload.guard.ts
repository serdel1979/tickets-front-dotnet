import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const reloadGuard: CanActivateFn = (route, state) => {



  return true;
};
