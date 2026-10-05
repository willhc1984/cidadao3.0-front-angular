import { Routes } from '@angular/router';

export const routes: Routes = [
    // Rota publica de Login
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: '',
        loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        children: [
            
        ]
    }
];
