import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = sessionStorage.getItem('accessToken');
    
  if (accessToken) {
    // Clonar el request para añadir el token en los headers
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  return next(req);
};
