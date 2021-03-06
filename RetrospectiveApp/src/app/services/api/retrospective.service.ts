import { Injectable } from '@angular/core';
import { Retrospective } from 'src/app/data/retrospective';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetrospectiveService {

  private readonly apiUrl = environment.apiUrl;
  constructor(private readonly httpClient: HttpClient) { }

  public getById(id: any): Observable<Retrospective> {
    return this.httpClient.get<Retrospective>(`${this.apiUrl}/retrospectives/${id}`);
  }

  public getByCode(code: any): Observable<Retrospective> {
    return this.httpClient.get<Retrospective>(`${this.apiUrl}/retrospectives/code/${code}`);
  }

  public create(name: string): Observable<Retrospective> {
    return this.httpClient.post(`${this.apiUrl}/retrospectives/${name}`, {});
  }

  public update(retrospective: Retrospective): Observable<Retrospective> {
    return this.httpClient.post(`${this.apiUrl}/retrospectives/${retrospective._id}`, retrospective);
  }
}
