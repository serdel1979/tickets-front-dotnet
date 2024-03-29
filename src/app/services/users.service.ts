import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioDetalle, Usuario } from '../interfaces/usuario.interface';


const BASEURL = environment.baseUrl;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  getUsers() {
    return this.http.get<UsuarioDetalle[]>(`${BASEURL}/usuarios`);
  }

  habilitaToggle(id: string, usr: any) {
    return this.http.put(`${BASEURL}/usuarios/habilitatoggle/${id}`, usr);
  }


  getUser(id: string) {
    return this.http.get<UsuarioDetalle>(`${BASEURL}/usuarios/detalle/${id}`);
  }

  hacerAdmin(usuario: UsuarioDetalle) {
    const user = {
      userName: usuario.userName
    }
    return this.http.post(`${BASEURL}/usuarios/haceradmin`, user);
  }

  borrarAdmin(usuario: UsuarioDetalle) {
    const user = {
      userName: usuario.userName
    }
    return this.http.post(`${BASEURL}/usuarios/borraradmin`, user);
  }

  resetPassword(formulario: any){
    const data={
      Usuario: formulario.user,
      Password: formulario.password2
    }
    return this.http.post(`${BASEURL}/usuarios/resetearPassword`,data);
  }

  guardaUsuario( usuario: string, email: string, password: string){
    const url = `${BASEURL}/usuarios/registrar`
    const body = {
      usuario,
      email,
      password
    }
    return this.http.post<any>(url,body);
  }

  borraUsuario(id: string) {
    const url = `${BASEURL}/usuarios/${id}`;
    return this.http.delete<any>(url);
  }
  


}
