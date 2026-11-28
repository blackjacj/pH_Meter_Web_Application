import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'
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
  imports: [DatePipe, RouterLink, ReactiveFormsModule, MatButtonModule,
            MatInputModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.css'
})
export class TestsComponent {
  private http = inject(HttpClient);

  tests: Test[] = [];
  filteredTests: Test[] = []
  dateControl = new FormControl<Date | null>(null);
  loading = true;
  error = '';

  ngOnInit() {
    this.http.get<Test[]>('http://127.0.0.1:5000/test').subscribe({
      next: (res) => {
        this.tests = res;
        this.filteredTests = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load your tests.';
        this.loading = false;
      }
    });
  }

  filterResults() {
    const picked = this.dateControl.value;
    if (!picked) {
      this.filteredTests = this.tests;
      return;
    }
    this.filteredTests = this.tests.filter(
      (test) => this.sameDay(new Date(test.date), picked)
    );
  }

  clearDate() {
    this.dateControl.reset();
    this.filteredTests = this.tests;
  }

  private sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }
}
