import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./home/home.component').then((m) => m.HomeComponent)
        },
    },
    {
        path: 'info',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./info/info.component').then((m) => m.InfoComponent)
        },
    },
    {
        path: 'login',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./login/login.component').then((m) => m.LoginComponent)
        },
    },
    {
        path: 'register',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./register/register.component').then((m) => m.RegisterComponent)
        },
    },
    {
        path: 'tests',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./tests/tests.component').then((m) => m.TestsComponent)
        },
    },
    {
        path: 'test-detail/:id',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./test-detail/test-detail.component').then((m) => m.TestDetailComponent)
        },
    },
];
