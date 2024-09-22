import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full'
  },
  {
    path: 'ingreso',
    loadChildren: () => import('./ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
  {
    path: 'correo',
    loadChildren: () => import('./correo/correo.module').then( m => m.CorreoPageModule)
  },
  {
    path: 'pregunta',
    loadChildren: () => import('./pregunta/pregunta.module').then( m => m.PreguntaPageModule)
  },
  {
    path: 'correcto',
    loadChildren: () => import('./correcto/correcto.module').then( m => m.CorrectoPageModule)
  },
  {
    path: 'incorrecto',
    loadChildren: () => import('./incorrecto/incorrecto.module').then( m => m.IncorrectoPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'mi-clase',
    loadChildren: () => import('./mi-clase/mi-clase.module').then( m => m.MiClasePageModule)
  },
  {
    path: 'mis-datos',
    loadChildren: () => import('./mis-datos/mis-datos.module').then(m => m.MisDatosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
