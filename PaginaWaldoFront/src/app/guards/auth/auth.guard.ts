import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn =  (route, state) => {
  
  const router = inject(Router);
  
  const token = sessionStorage.getItem('accessToken');
  if (token && !isTokenExpired(token)) {
    return true;
  } else {
     router.navigate(['/login']);
     sessionStorage.removeItem("accessToken");
     sessionStorage.removeItem("refreshToken");
     sessionStorage.removeItem("logedUser");
    return false;
  }
};

const isTokenExpired = (token: string): boolean => {
  const jwtToken = JSON.parse(atob(token.split('.')[1]));
  const expires = new Date(jwtToken.exp * 1000);
  const timeout = expires.getTime() - Date.now() ;
  return timeout < 0;
};