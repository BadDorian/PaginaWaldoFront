import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private userSubject: BehaviorSubject<string>;
  user$: Observable<string>;
  
  constructor() { 
    const userLoged = sessionStorage.getItem('logedUser')
    this.userSubject = new BehaviorSubject<string>(userLoged ? userLoged : "");
    this.user$ = this.userSubject.asObservable();
  }
  
  setUser(user: string) {
    
    sessionStorage.setItem('logedUser', user);
    this.userSubject.next(user)
  }

  getUser() {
    return this.userSubject.value;
  }

  clearUser() {
    sessionStorage.removeItem('logedUser')
  }
}
