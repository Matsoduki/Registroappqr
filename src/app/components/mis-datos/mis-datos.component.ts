import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Usuario } from 'src/app/model/usuario';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import { NivelEducacional } from 'src/app/model/nivel-educacional'; 
import { showToast } from 'src/app/tools/message-functions';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.scss'],
  standalone: true,
  imports: [IonLabel, 
    CommonModule,
    FormsModule,
    IonButton,
    IonInput,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonSelect,
    IonSelectOption
  ]
})
export class MisDatosComponent implements OnInit {
  usuario: Usuario = new Usuario();
  listaNivelesEducacionales: NivelEducacional[] = NivelEducacional.getNiveles();

  constructor(
    private bd: DatabaseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const usuarioAuth = await this.auth.readAuthUser();
      if (usuarioAuth) {
        this.usuario = usuarioAuth;
  
        // Asegúrate de que fechaDeNacimiento sea un objeto Date
        if (this.usuario.fechaDeNacimiento) {
          this.usuario.fechaDeNacimiento = new Date(this.usuario.fechaDeNacimiento); // Asigna un objeto Date
        }
      } else {
        showToast('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      showToast('Error al cargar los datos del usuario.');
    }
  }

  // Cambiamos guardarUsuario para ser asíncrono
  async guardarUsuario() {
    if (!this.usuario.nombre || this.usuario.nombre.trim() === '') {
      showToast('El usuario debe tener un nombre.');
      return;
    }
  
    try {
      await this.bd.saveUser(this.usuario); 
      this.auth.saveAuthUser(this.usuario); 
      showToast('El usuario fue guardado correctamente.');
    } catch (error) {
      console.error('Error guardando el usuario:', error);
      showToast('Error al guardar los datos del usuario.');
    }
  }

  public actualizarNivelEducacional(event: any) {
    const nivelId = event.detail.value;
    this.usuario.nivelEducacional = NivelEducacional.buscarNivel(nivelId)!; 
  }

  onFechaNacimientoChange(event: any) {
    const inputDate = event.detail.value; // Obtiene la fecha del evento
    if (inputDate) {
      const dateParts = inputDate.split('-'); // Separa el año, mes y día
      this.usuario.fechaDeNacimiento = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]); // Crea un objeto Date
    }
  }
 
  
}


