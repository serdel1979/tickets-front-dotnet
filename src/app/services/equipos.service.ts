import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Equipo, Equipos } from '../interfaces/equipos.paginado';


const URLapi = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(private http: HttpClient) { }


  getEquipos(page: number, porpagina:number){
    return this.http.get<Equipos>(`${URLapi}/equipos?Pagina=${page}&PorPagina=${porpagina}`,{ observe: 'response'});
  }

  guardaEquipo(eq:any){
    return this.http.post(`${URLapi}/equipos`,eq);
  }

  getEquiposFiltro(page: number, porpagina:number, buscados: string){
    return this.http.get<Equipos>(`${URLapi}/equipos/buscado?buscado=${buscados}&Pagina=${page}&PorPagina=${porpagina}`,{ observe: 'response'});
  }

  getEquipo(id:number){
    return this.http.get<Equipo>(`${URLapi}/equipos/detalle/${id}`);
  }

  actualizaEquipo(id:number,eq: any){
    return this.http.put(`${URLapi}/equipos/${id}`,eq);
  }

  getMisEquipos(id:string){
    return this.http.get<Equipo[]>(`${URLapi}/equipos/misequipos/${id}`);
  }
  

}
