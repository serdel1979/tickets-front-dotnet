import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';


const urlWS = environment.urlHubChat;

@Injectable({
  providedIn: 'root'
})
export class ChatredisService {

  private connection!: signalR.HubConnection;
  private connectionId!: string | null;

  groupName!: string;

  constructor() {
    this.startConnection()
        .then(()=>console.log('conectado'))
        .catch((err)=>console.error(err));

    this.onLoadMessages((messages: string[]) => {
      console.log(messages);
    });

    //carga los mensajes cuando llegan
    this.onReceiveMessage((messages: string[]) => {
      console.log(messages);
    });
  }

  public startConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(urlWS)
        .build();
  
      this.connection
        .start()
        .then(() => {
          console.log('Connection chat started');
          resolve();
        })
        .catch(err => {
          console.log('Error while starting connection: ' + err);
          reject(err);
        });
    });
  }


  public joinGroup(groupName: string): Promise<string[]> {
    this.groupName = groupName;
    return this.connection.invoke('JoinGroupChat', groupName);
  }

  public sendMessage(message: string): Promise<string[]> {
    return this.connection.invoke('SendMessageChat', this.groupName, message);
  }

  public deleteGroupMessages(groupName: string): Promise<string[]> {
    return this.connection.invoke('DeleteGroupMessagesChat', groupName);
  }

  public onReceiveMessage(callback: (messages: string[]) => void): void {
    this.connection.on('ReceiveMessage', callback);
  }

  public onLoadMessages(callback: (messages: string[]) => void): void {
    this.connection.on('LoadMessages', callback);
  }


  getConnectionId(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (this.connectionId) {
        resolve(this.connectionId);
      } else {
        reject(new Error('Connection not established'));
      }
    });
  }



}
function reject(err: any) {
  throw new Error('Function not implemented.');
}

