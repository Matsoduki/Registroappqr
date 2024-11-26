import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonFabButton, IonFab, IonList, IonCardContent, IonHeader
  , IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle
  , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
  , IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent
  , IonFabList } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { trashOutline, pencilOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseService } from 'src/app/services/database.service';
import { showToast } from 'src/app/tools/message-functions';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  standalone: true,
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonCard
    , IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem
    , IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol
    , IonButton, IonIcon, IonContent, IonCardContent
    , IonFab, IonFabButton, IonFabList
    , CommonModule, FormsModule, TranslateModule]
})
export class UsuariosComponent  implements OnInit {

  users: any[] = [];

  constructor(private auth: AuthService, private bd: DatabaseService) {
    addIcons({pencilOutline,trashOutline});
  }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.users = await this.bd.readUsers(); // Asume que readUsers devuelve una lista de usuarios
  }

  async deleteUser(username: string) {
    console.log('Eliminar usuario:', username);
    try {
      await this.bd.deleteByUsername(username);
      showToast('El usuario fue eliminado correctamente.');
      this.loadUsers();
    } catch (error) {
      showToast('Error al eliminar el usuario.');
    }
  }
}
