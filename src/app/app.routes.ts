import { Routes } from '@angular/router';
import { loginGuard } from './guards/login.guard';
import { homeGuard } from './guards/home.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full',
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./pages/ingreso/ingreso.page').then(m => m.IngresoPage),
    canActivate: [loginGuard]
  },
  {
    path: 'mi-clase', // Añadir esta línea
    loadComponent: () => import('./components/mi-clase/mi-clase.component').then(m => m.MiClaseComponent) // Asegúrate de que la ruta sea correcta
  },
  {
    path: 'miruta',
    loadComponent: () => import('./pages/miruta/miruta.page').then(m => m.MiRutaPage)
  },
  {
    path: 'correo',
    loadComponent: () => import('./pages/correo/correo.page').then(m => m.CorreoPage),
    canActivate: [loginGuard]
  },
  {
    path: 'temas',
    loadComponent: () => import('./pages/temas/temas.page').then(m => m.TemasPage)
  },
  {
    path: 'pregunta',
    loadComponent: () => import('./pages/pregunta/pregunta.page').then(m => m.PreguntaPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then(m => m.IncorrectoPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then(m => m.CorrectoPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage),
    canActivate: [homeGuard]
  },
  {
    path: 'registrarme',
    loadComponent: () => import('./pages/registrarme/registrarme.page').then( m => m.RegistrarmePage)
  }
];