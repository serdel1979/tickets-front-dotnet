import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';


const BASEURL = environment.baseUrl;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }



  getUsers(){
    return this.http.get<any[]>(`${BASEURL}/usuarios`);
  }

}
