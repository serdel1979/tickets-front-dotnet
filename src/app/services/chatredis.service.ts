import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';


const urlWS = environment.urlHubChat;

@Injectable({
  providedIn: 'root'
})
export class ChatredisService {

  private connection!: signalR.HubConnection;
  private connectionId!: string | null;

  groupName!: string;
  userLogued!: string;


  private activeMessagesIndicators: { [key: string]: Subject<boolean> } = {};


  constructor(private authService: AuthService) {

   // this.authService.isLoggedInChange.subscribe(() => {

      this.startConnection()
        .then()
        .catch((err) => console.error(err));

      this.onLoadMessages((messages: string[]) => {});

      //carga los mensajes cuando llegan
      this.onReceiveMessage((groupName: string, messages: string[]) => {
        if (this.activeMessagesIndicators[groupName]) {
          this.activeMessagesIndicators[groupName].next(true);
        }
      });

   // })

  }


  public getActiveMessagesIndicator(user: string): Subject<boolean> {
    if (!this.activeMessagesIndicators[user]) {
      this.activeMessagesIndicators[user] = new Subject<boolean>();
    }
    return this.activeMessagesIndicators[user];
  }

  public startConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(urlWS)
        .build();

      this.connection
        .start()
        .then(() => {
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

  public onReceiveMessage(callback: (groupName: string, messages: string[]) => void): void {
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

