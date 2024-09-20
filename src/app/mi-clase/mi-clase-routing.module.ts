import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiClasePage } from './mi-clase.page';

const routes: Routes = [
  {
    path: '',
    component: MiClasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiClasePageRoutingModule {}
