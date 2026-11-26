import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  username$ = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  login(username: string) {
    localStorage.setItem('username', username);
    this.username$.next(username);
  }

  logout() {
    localStorage.removeItem('username');
    this.username$.next(null);
  }
}
