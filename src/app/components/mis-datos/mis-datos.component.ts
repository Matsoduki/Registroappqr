import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardContent, IonInput, IonItem, IonSelect, IonSelectOption, IonLabel, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonFooter } from '@ionic/angular/standalone';
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
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFooter
  ]
})
export class MisDatosComponent implements OnInit {
  usuario: Usuario = new Usuario();
  listaNivelesEducacionales: NivelEducacional[] = NivelEducacional.getNiveles();
  fechaNacimientoString: string = '';
  repetirPassword: string = ''; // Asegúrate de definir esta propiedad
  selectedImage: string | ArrayBuffer | null = null; // Para almacenar la imagen seleccionada

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
  
        // Convertir fechaDeNacimiento a string para el input
        if (this.usuario.fechaDeNacimiento) {
          this.fechaNacimientoString = this.formatDateToInput(this.usuario.fechaDeNacimiento);
        }
  
        // Asignar la imagen seleccionada desde el usuario
        this.selectedImage = this.usuario.foto || 'assets/img/noPhoto.png'; // Mostrar noPhoto.png si no hay foto
      } else {
        showToast('No se encontró información del usuario.');
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      showToast('Error al cargar los datos del usuario.');
    }
  }

  formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public onFechaNacimientoChange(event: any) {
    const inputDate = event.detail.value; // Obtiene la fecha del evento
    if (inputDate) {
      const parts = inputDate.split('-');
      this.usuario.fechaDeNacimiento = new Date(+parts[0], +parts[1] - 1, +parts[2]); // Convierte a Date
      this.fechaNacimientoString = inputDate; // Actualiza la variable string
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.selectedImage = reader.result; // Guarda la imagen en el formato adecuado
        this.usuario.foto = this.selectedImage as string; // Guarda la imagen en el objeto Usuario
      };
      
      reader.readAsDataURL(file); // Lee la imagen como URL
    }
  }

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
}