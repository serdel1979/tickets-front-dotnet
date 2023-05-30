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


  getMisSolicitudes(id:string){
    return this.http.get<Solicitud[]>(`${this.baseUrl}/solicitudes/${id}/missolicitudes`)
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


}
