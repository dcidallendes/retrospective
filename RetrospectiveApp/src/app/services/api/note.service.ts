import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from 'src/app/data/note';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly httpClient: HttpClient) { }

  public getByRetrospectiveId(retrospectiveId: any): Observable<Note[]> {
    return this.httpClient.get<Note[]>(`${this.apiUrl}/notes/retrospective/${retrospectiveId}`);
  }

  public getById(noteId: any): Observable<Note> {
    return this.httpClient.get<Note>(`${this.apiUrl}/notes/${noteId}`);
  }

  public create(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(`${this.apiUrl}/notes/`, note);
  }

  public update(note: Note): Observable<Note>  {
    return this.httpClient.post<Note>(`${this.apiUrl}/notes/${note._id}`, note);
  }

  public addVote(noteId: any, userId: string): Observable<Note> {
    return this.httpClient.post<Note>(`${this.apiUrl}/notes/${noteId}/vote/${userId}`, {});
  }
}
