import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  isLoggedIn: boolean = false;
  private authS = inject(AuthService);
  username: string | null = null;

  ngOnInit() {
    this.authS.username$.subscribe((name) => this.username = name);
  }

  private router = inject(Router);
  private http = inject(HttpClient);

logout() {
  this.http.post('http://127.0.0.1:5000/logout', {}).subscribe({
    complete: () => this.finishLogout(),
    error: () => this.finishLogout()
  });
}

finishLogout() {
  localStorage.removeItem('token');
  this.authS.logout();
  this.router.navigate(['/login']);
}

}
