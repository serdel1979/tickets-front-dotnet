import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const URLapi = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(private http: HttpClient) { }


  getEquipos(page: number, porpagina:number){
    return this.http.get<any[]>(`${URLapi}/equipos?Pagina=${page}&PorPagina=${porpagina}`, { observe: 'response' });
  }


}
