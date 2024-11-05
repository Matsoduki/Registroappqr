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
    loadComponent: () => import('./pages/ingreso/ingreso.page').then( m => m.IngresoPage),
    canActivate: [loginGuard]
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/map/map.page').then( m => m.MapPage),
  },
  {
    path: 'theme',
    loadComponent: () => import('./pages/theme/theme.page').then( m => m.ThemePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [homeGuard]
  },
  {
    path: 'miruta',
    loadComponent: () => import('./pages/miruta/miruta.page').then( m => m.MirutaPage)
  },
  {
    path: 'correo',
    loadComponent: () => import('./pages/correo/correo.page').then( m => m.CorreoPage)
  },
  {
    path: 'pregunta',
    loadComponent: () => import('./pages/pregunta/pregunta.page').then( m => m.PreguntaPage)
  },
  {
    path: 'correcto',
    loadComponent: () => import('./pages/correcto/correcto.page').then( m => m.CorrectoPage)
  },
  {
    path: 'incorrecto',
    loadComponent: () => import('./pages/incorrecto/incorrecto.page').then( m => m.IncorrectoPage)
  },
  {
    path: 'temas',
    loadComponent: () => import('./pages/temas/temas.page').then( m => m.TemasPage)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage)
  },
  {
    path: 'codigoqr',
    loadComponent: () => import('./pages/codigoqr/codigoqr.page').then( m => m.CodigoqrPage)
  },
  {
    path: 'miclase',
    loadComponent: () => import('./pages/miclase/miclase.page').then( m => m.MiclasePage)
  },
  {
    path: 'misdatos',
    loadComponent: () => import('./pages/misdatos/misdatos.page').then( m => m.MisdatosPage)
  },
  {
    path: 'foro',
    loadComponent: () => import('./pages/foro/foro.page').then( m => m.ForoPage)
  },
];
