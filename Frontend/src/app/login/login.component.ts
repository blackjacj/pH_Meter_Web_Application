import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private http = inject(HttpClient)
  private router = inject(Router)

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  error = '';
  loading = false;

   onSubmit() {
    if (this.loginForm.invalid) return;

    this.error = '';
    this.loading = true;

    this.http.post<any>('http://127.0.0.1:5000/login', this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        this.loading = false;
        this.router.navigate(['/'])
        console.log('Logged in!');
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
