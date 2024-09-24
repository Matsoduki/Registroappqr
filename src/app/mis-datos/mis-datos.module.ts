import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MisDatosPageRoutingModule } from './mis-datos-routing.module';
import { MisDatosPage } from './mis-datos.page';
import { MatDatepickerModule } from  '@angular/material/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisDatosPageRoutingModule,
    MatDatepickerModule
  ],
  declarations: [MisDatosPage]
})
export class MisDatosPageModule {}