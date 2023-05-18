import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/usuario.interface';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;

  private _usuario!: Usuario;

  get usuario(){
    return this._usuario;
  }


  constructor(private http: HttpClient) { }


  login( usuario: string, password: string){
    const url = `${this.baseUrl}/usuarios/login`
    const body = {
      usuario,
      password
    }
    return this.http.post<AuthResponse>(url,body)
    .pipe(
      tap( (resp) =>{
        if(resp.ok){
          localStorage.setItem('token',resp.token!);
        }
      }),
      map( resp => resp.ok),
      catchError(err=> of(err.error))
    )
  }

}
