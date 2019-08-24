import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Retrospective } from 'src/app/data/retrospective';
import { Note } from 'src/app/data/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private readonly apiUrl = 'http://127.0.0.1:3001/api/v1';
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
