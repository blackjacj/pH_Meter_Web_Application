import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Test {
  id: number;
  name: string;
  note: string;
  date: string;
}

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.css'
})
export class TestsComponent {
  private http = inject(HttpClient);

  tests: Test[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.http.get<Test[]>('http://127.0.0.1:5000/test').subscribe({
      next: (res) => {
        this.tests = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load your tests.';
        this.loading = false;
      }
    });
  }
}
