import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioDetalle } from '../interfaces/usuario.interface';


const BASEURL = environment.baseUrl;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  getUsers(){
    return this.http.get<UsuarioDetalle[]>(`${BASEURL}/usuarios`);
  }

  habilitaToggle(id: string, usr:any){
    return this.http.put(`${BASEURL}/usuarios/habilitatoggle/${id}`, usr);
  }


  getUser(id: string){
    return this.http.get<UsuarioDetalle>(`${BASEURL}/usuarios/detalle/${id}`);
  }

  hacerAdmin(usuario: UsuarioDetalle){
      const user = {
        userName: usuario.userName 
      }  
      return this.http.post(`${BASEURL}/usuarios/haceradmin`,user);
  }

  borrarAdmin(usuario: UsuarioDetalle){
    const user = {
      userName: usuario.userName 
    }  
    return this.http.post(`${BASEURL}/usuarios/borraradmin`,user);
}


}
