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
];
