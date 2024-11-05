import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Post } from '../model/post';
import { showAlertError } from '../tools/message-functions';
import { AuthService } from './auth.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class APIClientService {

  httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'access-control-allow-origin': '*'
    })
  };

  apiUrl = 'http://localhost:3000';
  //apiUrl = 'http://192.168.100.227:3000';
  postList: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) { }

  // Crear una publicación y actualizar postList; devuelve el registro recién creado
  async createPost(post: Post): Promise<Post | null> {
    try {
      const postWithoutId = {
        "title": post.title,
        "body": post.body,
        "author": post.author,
        "date": post.date,
        "authorImage": post.authorImage
      };

      const createdPost = await lastValueFrom(
        this.http.post<Post>(this.apiUrl + '/posts', 
          postWithoutId, this.httpOptions).pipe(retry(3))
      );
      await this.refreshPostList();
      return createdPost;
    } catch (error) {
      showAlertError('APIClientService.createPost', error);
      return null;
    }
  }

  // Actualizar una publicación; devuelve la publicación actualizada
  async updatePost(post: Post): Promise<Post | null> {
    try {
      const updatedPost = await lastValueFrom(
        this.http.put<Post>(this.apiUrl + '/posts/' + post.id, 
          post, this.httpOptions).pipe(retry(3))
      );
      await this.refreshPostList();
      return updatedPost;
    } catch (error) {
      showAlertError('APIClientService.updatePost', error);
      return null;
    }
  }

  // Eliminar una publicación; devuelve true si se eliminó exitosamente
  async deletePost(id: number): Promise<boolean> {
    try {
      await lastValueFrom(
        this.http.delete(this.apiUrl + '/posts/' + id, this.httpOptions).pipe(retry(3))
      );
      await this.refreshPostList();
      return true;
    } catch (error) {
      showAlertError('APIClientService.deletePost', error);
      return false;
    }
  }

  // Refrescar el listado de publicaciones y notificar a los suscriptores
  async refreshPostList(): Promise<void> {
    try {
      const posts = await this.fetchPosts();
      console.log(posts);
      this.postList.next(posts);
    } catch (error) {
      showAlertError('APIClientService.refreshPostList', error);
    }
  }

  // Obtener todas las publicaciones desde la API
  async fetchPosts(): Promise<Post[]> {
    try {
      const posts = await lastValueFrom(
        this.http.get<Post[]>(this.apiUrl + '/posts').pipe(retry(3)));
      return posts.reverse();
    } catch (error) {
      this.handleHttpError('APIClientService.fetchPosts', error);
      return [];
    }
  }

  // Manejo de errores HTTP con detección de códigos de estado
  private handleHttpError(methodName: string, error: any): void {
    if (error instanceof HttpErrorResponse) {
      const statusCode = error.status;
      if (statusCode === 400) {
        showAlertError(`${methodName} - Solicitud incorrecta (400)`, error.message);
      } else if (statusCode === 401) {
        showAlertError(`${methodName} - No autorizado (401)`, error.message);
      } else if (statusCode === 404) {
        showAlertError(`${methodName} - No encontrado (404)`, error.message, true);
      } else if (statusCode === 500) {
        showAlertError(`${methodName} - Error interno del servidor (500)`, error.message);
      } else {
        showAlertError(`${methodName} - Error inesperado (${statusCode})`, error.message);
      }
    } else {
      showAlertError(`${methodName} - Error desconocido`, error);
    }
  }
}
