import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { NewMessage } from '../interfaces/messages.interface';


const URLHub = environment.urlHub;



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private connection: HubConnection;
  public joined = false;
  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();
  }


  public async leave(grupo: string, usuario: string) {
    this.connection.invoke('LeaveGroup', grupo, usuario)
      .then(_ => this.joined = false);
  }



  public async join(grupo: string, usuario: string) {
    this.connection.invoke('JoinGroup', grupo, usuario)
      .then(_ => {
        this.joined = true;
      });
  }

  public sendMessage(mensaje: NewMessage) {
     return this.connection.invoke('SendMessage', mensaje);
  }

  public getConection(){
    return this.connection;
  }

 
}
