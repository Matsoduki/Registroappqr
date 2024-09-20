import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiClasePageRoutingModule } from './mi-clase-routing.module';

import { MiClasePage } from './mi-clase.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiClasePageRoutingModule
  ],
  declarations: [MiClasePage]
})
export class MiClasePageModule {}
