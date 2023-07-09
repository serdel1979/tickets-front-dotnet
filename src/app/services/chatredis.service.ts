import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { promises } from 'dns';


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

  private anyGroupHasNewMessagesSubject: Subject<boolean> = new Subject<boolean>();


  newMessageIndicators: { [key: string]: boolean } = {};


  constructor(private authService: AuthService) {
    this.startConnection()
      .then(() => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
          this.initializeNewMessageIndicators();
          console.log(this.connection.connectionId, ' ', this.connection.state);
        } else {
          console.log('Connection is not in the "Connected" state.');
        }
      })
      .catch((err) => console.error(err));

    this.onLoadMessages((groupName: string, messages: string[]) => {
      if (this.activeMessagesIndicators[groupName]) {
        this.newMessageIndicators[groupName] = messages.length > 0;
        this.activeMessagesIndicators[groupName].next(messages.length > 0);
      }
    });
    //carga los mensajes cuando llegan
    this.onReceiveMessage((groupName: string, messages: string[]) => {
      if (this.activeMessagesIndicators[groupName]) {
        this.newMessageIndicators[groupName] = true;
        this.activeMessagesIndicators[groupName].next(true);
      }
    });
  }

  private initializeNewMessageIndicators(): void {
    this.connection.invoke('GetNewMessageIndicators')
      .then((indicators: { [key: string]: boolean }) => {
        this.newMessageIndicators = indicators;
      })
      .catch((error: any) => {
        console.error('Error while initializing new message indicators:', error);
      });
  }

  public getIndicators() {
    return this.newMessageIndicators;
  }

  public getAnyGroupHasNewMessages(): Subject<boolean> {
    return this.anyGroupHasNewMessagesSubject;
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
  
      this.connection.onclose((error: any) => {
        console.log('Connection closed:', error);
        // Aquí puedes manejar la lógica de reconexión si lo deseas
      });
  
      this.connection.onreconnected(() => {
        this.initializeNewMessageIndicators();
      });
  
      this.connection.on("AnyGroupHasNewMessages", (hasNewMessages: boolean) => {
        this.anyGroupHasNewMessagesSubject.next(hasNewMessages);
      });
  
      this.connection.start()
        .then(() => {
          resolve();
        })
        .catch(err => {
          console.log('Error while starting connection: ' + err);
          reject(err);
        });
    });
  }
  


  public anyGroupHasNewMessages(): Subject<boolean> {
    this.connection.invoke('AnyGroupHasNewMessages')
      .then((hasNewMessages: boolean) => {
        this.anyGroupHasNewMessagesSubject.next(hasNewMessages);
      })
      .catch(error => {
        console.error('Error invoking AnyGroupHasNewMessages:', error);
      });

    return this.anyGroupHasNewMessagesSubject;
  }

  public joinGroup(groupName: string): Promise<string[]> {
    this.groupName = groupName;
    return this.connection.invoke('JoinGroupChat', groupName);
  }

  public sendMessage(message: string): Promise<string[]> {
    return this.connection.invoke('SendMessageChat', this.groupName, message);
  }

  public deleteGroupMessages(groupName: string): Promise<string[]> {
    this.newMessageIndicators[groupName] = false;
    this.activeMessagesIndicators[groupName].next(false);
    return this.connection.invoke('DeleteGroupMessagesChat', groupName);
  }

  public initAnyGroupHasNewMessages(): Promise<boolean> {
    return this.connection.invoke('GetAnyGroupHasNewMessages');
  }

  public onReceiveMessage(callback: (groupName: string, messages: string[]) => void): void {
    this.connection.on('ReceiveMessage', callback);
  }

  public onLoadMessages(callback: (groupName: string, messages: string[]) => void): void {
    this.connection.on('LoadMessages', callback);
  }

  public loadMessages(groupName: string): Promise<string[]> {
    return this.connection.invoke('LoadMessages', groupName);
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

