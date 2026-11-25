import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-test-detail',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.css'
})
export class TestDetailComponent implements OnInit{
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = Number(this.route.snapshot.paramMap.get('id'));
  url = `http://127.0.0.1:5000/test/${this.id}`;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(80)]),
    note: new FormControl('', Validators.maxLength(500))
  });

  message = '';
  error = '';

  ngOnInit(): void {
    this.http.get<any>(this.url).subscribe({
      next: (test) => this.form.setValue({ name: test.name, note: test.note ?? ''}),
      error: () => this.error = 'Could not load this test.'
    });
  }

  save() {
    if (this.form.invalid) return;
    this.message = '';
    this.error = '';

    this.http.put<any>(this.url, this.form.value).subscribe({
      next: () => this.message = 'Saved!',
      error: (err) => this.error = err.error?.message || 'Could not save.'
    });
  }

  downloadCsv() {
    this.http.get(`${this.url}/export`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${this.form.value.name || 'test'}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      },
      error: () => this.error = 'Could not download the CSV.'
    });
  }

  deleteTest() {
    const ok = confirm(
      `Delete "${this.form.value.name}" and all of its readings? This cannot be undone.`
    );
    if (!ok) return;

    this.http.delete(this.url).subscribe({
      next: () => this.router.navigate(['/tests']),
      error: () => this.error = 'Could not delete the test.'
    });
  }
}

