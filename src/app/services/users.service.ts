import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


const BASEURL = environment.baseUrl;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  getUsers(){
    return this.http.get<any[]>(`${BASEURL}/usuarios`);
  }

  habilitaToggle(id: string, usr:any){
    console.log(BASEURL);
    return this.http.put(`${BASEURL}/usuarios/habilitatoggle/${id}`, usr);
  }

}
