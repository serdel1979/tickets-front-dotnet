import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { NewMessage } from '../interfaces/messages.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subject } from 'rxjs';


const mapUsersChat: Map<string, NewMessage[]> = new Map();

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public userList: string[] = [];

  public connection: HubConnection;


  private mensajesSubject = new Subject<any>();
  mensajes$: Observable<NewMessage> = this.mensajesSubject.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.urlHub)
      .build();

    this.connection.start().then(() => {
      const usrName = this.authService.getUserLogued();
      this.http.get<any[]>(`${environment.baseUrl}/usuarios/chat`).subscribe(async usr=>{
        for (const usuario of usr) {
            await this.join(usuario.userName, usrName);
            mapUsersChat.set(usuario.userName, []);
        }
      })
    });

    console.log(`mapeo creado en servicio? ${mapUsersChat}`);

    this.connection.on('NewMessage', (mensaje: NewMessage) => {
      console.log(mensaje);
      this.mensajesSubject.next(mensaje);
    });
  }


  getConnection(){
    return this.connection;
  }


  getMapUsersChat(){
    return mapUsersChat;
  }

  public join(groupName:string,userName:string): Promise<void> {
    return this.connection.invoke('JoinGroup', groupName, userName)
      .then(_ => {
        true;
      });
  }




}
