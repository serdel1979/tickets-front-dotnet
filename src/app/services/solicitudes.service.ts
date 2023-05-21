import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getMisSolicitudes(id:string){
    return this.http.get<any[]>(`${this.baseUrl}/solicitudes/${id}/missolicitudes`)
  }


}
