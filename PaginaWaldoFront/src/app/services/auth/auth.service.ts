import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject,  map, Observable, of, tap } from 'rxjs';

import { Router } from '@angular/router';
import { AuthResponse } from '../../models/auth-response';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + 'api/auth';
  private refreshTokenTimeout : any;
  private currentUserSubject: BehaviorSubject<string | null>;
  public currentUser: Observable<string | null>;
  constructor(private http: HttpClient, private router : Router) {
    const storedUser = localStorage.getItem('logedUser');
    this.currentUserSubject = new BehaviorSubject<string | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  public get currentUserValue(): string | null {
    return this.currentUserSubject.value;
  }


  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.accessToken && response.refreshToken) {
          sessionStorage.setItem('accessToken', response.accessToken);
          sessionStorage.setItem('refreshToken', response.refreshToken);
          sessionStorage.setItem('logedUser', email);
          this.currentUserSubject.next(email);
          this.startRefreshTokenTimer();
        } else {
          console.error('Invalid login response');
        }
      })
    );
  }

  logout(): void {
    sessionStorage.clear();  // Limpiar sessionStorage
    this.stopRefreshTokenTimer();
    this.router.navigate(['/']);
  }
  refreshToken(): Observable<AuthResponse> {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!accessToken || !refreshToken) {
      console.error('Access token or refresh token is null');
      return of(); // Devuelve un observable vacío
    }
  
    const tokenModel = {
      accessToken,
      refreshToken
    };
  
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, tokenModel).pipe(
      map((response: AuthResponse) => {
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('refreshToken', response.refreshToken);
        this.startRefreshTokenTimer();
        return response;
      })
    );
  }

  startRefreshTokenTimer() {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }
  
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now(); // 5 minutos antes de expirar
  
    if (timeout <= 0) {
      this.logout();  // Cerrar sesión si el token ya expiró
    } else {
      this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }
  }

  stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }

  
}