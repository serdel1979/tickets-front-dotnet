import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.urlHub) // URL del concentrador en tu servidor
      .build();

      this.connection.on("NewMessage", message => this.newMessage(message));
  }


  startConnection(): Promise<void> {
    return this.connection.start().then(() => {
      console.log('Connection Started service');
    }).catch((error: any) => {
      console.error(error);
    });
  }

  getConnection(){
    return this.connection;
  }
  
  newMessage(msj: string){
    console.log(msj);
  }

}
