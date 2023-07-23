import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { error } from 'console';
import { Solicitud } from '../interfaces/solicitud.interface';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }


  getMisSolicitudes(){
    return this.http.get<Solicitud[]>(`${this.baseUrl}/solicitudes/missolicitudes`)
  }

  getSolicitudes(){
    return this.http.get<Solicitud[]>(`${this.baseUrl}/solicitudes`)
  }

  enviaSolicitud(form: any):Observable<any>{
    return this.http.post(`${this.baseUrl}/solicitudes`,form)
      .pipe(
        tap(res=>{
          console.log('ok',res);
        }),
        map(()=>true),

        catchError(err=> throwError(()=>'No se envió la solicitud!!!'))
      )
  }

  getDetalleSolicitud(id:number){
    return this.http.get<Solicitud>(`${this.baseUrl}/solicitudes/getmisolicitud/${id}`)
  }


  getSolicitud(id:number){
    return this.http.get<Solicitud>(`${this.baseUrl}/solicitudes/${id}`)
  }

  getEstadosPosibles(id:number){
    return this.http.get<any>(`${this.baseUrl}/solicitudes/estadosposibles/${id}`)
  }

  agregaEstado(form:any,idSolicitud:number){
    return this.http.post<any>(`${this.baseUrl}/solicitudes/estados/${idSolicitud}/nuevo`,form);
  }

}
