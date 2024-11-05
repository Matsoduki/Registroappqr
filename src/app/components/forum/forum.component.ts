import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { APIClientService } from 'src/app/services/apiclient.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonFabButton, IonFab, IonList, IonCardContent, IonHeader
  , IonToolbar, IonTitle, IonCard, IonCardHeader, IonCardTitle
  , IonCardSubtitle, IonItem, IonLabel, IonInput, IonTextarea
  , IonGrid, IonRow, IonCol, IonButton, IonIcon, IonContent
  , IonFabList } from '@ionic/angular/standalone';
import { pencilOutline, trashOutline, add } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from 'src/app/model/post';
import { showToast } from 'src/app/tools/message-functions';
import { addIcons } from 'ionicons';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: true,
  imports: [IonList, IonHeader, IonToolbar, IonTitle, IonCard
    , IonCardHeader, IonCardTitle, IonCardSubtitle, IonItem
    , IonLabel, IonInput, IonTextarea, IonGrid, IonRow, IonCol
    , IonButton, IonIcon, IonContent, IonCardContent
    , IonFab, IonFabButton, IonFabList
    , CommonModule, FormsModule]
})
export class ForumComponent implements OnInit, OnDestroy {

  post: Post = new Post();
  posts: Post[] = [];
  selectedPostText = '';
  intervalId: any = null;
  user = new User();
  private postsSubscription!: Subscription;
  private userSubscription!: Subscription;

  constructor(private api: APIClientService, private auth: AuthService) {
    addIcons({ pencilOutline, trashOutline, add });
  }

  ngOnInit() {
    this.postsSubscription = this.api.postList.subscribe((posts) => {
      this.posts = posts;
    });
    this.userSubscription = this.auth.authUser.subscribe((user) => {
      this.user = user? user : new User();
    });
    this.api.refreshPostList(); // Actualiza lista de posts al iniciar
  }

  ngOnDestroy() {
    if (this.postsSubscription) this.postsSubscription.unsubscribe();
  }

  cleanPost() {
    this.post = new Post();
    this.selectedPostText = 'Nueva publicación';
  }

  savePost() {
    if (!this.post.title.trim()) {
      showToast('Por favor, completa el título.');
      return;
    }
    if (!this.post.body.trim()) {
      showToast('Por favor, completa el cuerpo.');
      return;
    }

    if (this.post.id) {
      this.updatePost();
    } else {
      this.createPost();
    }
  }

  private async createPost() {
    this.post.author = this.user.firstName + ' ' + this.user.lastName;
    const createdPost = await this.api.createPost(this.post);
    if (createdPost) {
      showToast(`Publicación creada correctamente: ${createdPost.title}`);
      this.cleanPost();
    }
  }

  private async updatePost() {
    this.post.author = this.user.firstName + ' ' + this.user.lastName;
    const updatedPost = await this.api.updatePost(this.post);
    if (updatedPost) {
      showToast(`Publicación actualizada correctamente: ${updatedPost.title}`);
      this.cleanPost();
    }
  }

  editPost(post: Post) {
    this.post = { ...post }; // Crea una copia para editar sin afectar la lista
    this.selectedPostText = `Editando publicación #${post.id}`;
    document.getElementById('topOfPage')!.scrollIntoView({ behavior: 'smooth' });
  }

  async deletePost(post: Post) {
    const success = await this.api.deletePost(post.id);
    if (success) {
      showToast(`Publicación eliminada correctamente: ${post.id}`);
      this.cleanPost();
    }
  }

  getPostId(index: number, post: Post) {
    return post.id;
  }
}
