import { Component, Input, OnInit } from '@angular/core';
import { Asistencia } from 'src/app/model/asistencia';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-mi-clase',
  templateUrl: './mi-clase.component.html',
  styleUrls: ['./mi-clase.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class MiClaseComponent implements OnInit {
  @Input() asistencia!: Asistencia | null;

  ngOnInit() {
    if (this.asistencia) {
      console.log('Asistencia recibida:', this.asistencia);
    } else {
      console.error('No se recibieron datos de asistencia');
    }
  }
}