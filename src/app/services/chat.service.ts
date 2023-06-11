import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
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


  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.urlHub)
      .build();

    this.connection.start().then(() => {
      this.connection.on('NewMessage', (mensaje: NewMessage) => {
        console.log(mensaje);
        this.mensajesSubject.next(mensaje);
      });
    });
  }


  getConnection(){
    return this.connection;
  }



  public join(groupName:string,userName:string): Promise<void> {
    return this.connection.invoke('JoinGroup', groupName, userName)
      .then(_ => {
        true;
      });
  }




}
