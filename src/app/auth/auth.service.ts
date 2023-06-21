import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario, UsuarioChat } from '../interfaces/usuario.interface';
import { Subject, catchError, map, of, tap } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;

  private _usuario!: Usuario;

  private userName: string = '';

  

  public isLoggedInChange: Subject<boolean> = new Subject<boolean>();


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

  loginOk(){
    this.isLoggedInChange.next(true);
  }

  logout(){
    this.isLoggedInChange.next(false);
    localStorage.clear();
  }

  isAdmin(){
    let objetoString: string | null = localStorage.getItem('usrlog');
    if (objetoString) {
        let usr: any = JSON.parse(objetoString);
        if(usr.claims == 1){
          return true;
        }
    }
    return false;
  }

  getUserLogued(){
    let objetoString: string | null = localStorage.getItem('usrlog');
    if (objetoString) {
        let usr: any = JSON.parse(objetoString);
        if(usr.userName){
          return usr.userName;
        }
    }
    return null;
  }

  isLogued(){
    let token = localStorage.getItem('token');
    if (token != null) {
      let jwt: any;
      jwt = jwt_decode(token);
  
      let fechaExpira = new Date(jwt.exp * 1000);
      let currentDate = new Date();
      
      let dif = fechaExpira.getTime() - currentDate.getTime(); // Diferencia en milisegundos

      if (fechaExpira  > currentDate) return true;
    }
    return false;
  }

  getExpireToken(token: string){
    let jwt:any;
    if(token){
      jwt = jwt_decode(token);
    }
    return jwt.exp;  
  }

  getIdLogued(){
    let objetoString: string | null = localStorage.getItem('usrlog');
    if (objetoString) {
        let usr: any = JSON.parse(objetoString);
        if(usr){
          return usr.id;
        }
    }
    return '';
  }

  getAllUsers(){
    return this.http.get<UsuarioChat[]>(`${environment.baseUrl}/usuarios/chatredis/${this.getUserLogued()}`);
  }

 
}
