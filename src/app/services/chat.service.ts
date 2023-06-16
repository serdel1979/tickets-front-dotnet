import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ChatDataService } from './chat-data.service';

const URLHub = environment.urlHub;

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  chatList: any[] = [];

  private hubConnection!: signalR.HubConnection;

  constructor(private authService: AuthService, private chatDataService: ChatDataService) {
    //this.startConnection();
  }

  // public startConnection() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(URLHub)
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .then(() => console.log('Connection HUB started'))
  //     .catch(err => console.log('Error while starting connection: ' + err));
  // }

  public startConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(URLHub)
        .build();
  
      this.hubConnection
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

  public addToGroup(groupName: string, userName: string){
    this.hubConnection.invoke('JoinGroup', groupName, userName)
      .then(_ => {
        console.log(`${userName} unido a ${groupName}`);
        true;
      }).catch(err=> console.error(err));
  }




  public removeFromGroup(groupName: string){
    this.hubConnection.invoke('RemoveFromGroup', groupName)
      .catch(err => console.error(err));
  }

  public sendToGroup(groupName: string, message: string){
    this.hubConnection.invoke('SendMessage', {
      userName: this.authService.getUserLogued(), // Reemplaza con el nombre de usuario real
      message: message,
      groupName: groupName
    }).catch(err => console.error(err));
  }

  // public onNewMessage(): Observable<any> {
  //   return new Observable<any>(observer => {
  //     this.hubConnection.on('NewMessage', (message: any) => {
  //       this.chatList.push(message);
  //       observer.next(message);
  //     });
  //   });
  // }

  public onNewMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.hubConnection.on('NewMessage', (message: any) => {
        this.chatDataService.updateChatList([...this.chatDataService.getChatList(), message]);
        observer.next(message);
      });
    });
  }

  public getMessages(){
    return this.chatList;
  }

  conected(){
    return this.hubConnection != undefined;
  }
}
