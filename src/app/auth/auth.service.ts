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
    return this.http.post<AuthResponse>(url,body);
  }


  solicitaUsuario( usuario: string, email: string, password: string){
    const url = `${this.baseUrl}/usuarios/solicitar`
    const body = {
      usuario,
      email,
      password
    }
    return this.http.post<AuthResponse>(url,body);
  }

}
