import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { NewMessage } from '../interfaces/messages.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private mapUsersChat: Map<string, NewMessage[]> = new Map();


  private adminsLogued: Set<string> = new Set();

  public userList: string[] = [];

  public connection: HubConnection;

  private endSave: boolean = false;

  private mensajesSubject = new Subject<any>();

  private admin= new Subject<boolean>();

  mensajes$: Observable<NewMessage> = this.mensajesSubject.asObservable();
  adminConnect$: Observable<boolean> = this.admin.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.urlHub)
      .build();

    this.connection.start().then(() => {
      const usrName = this.authService.getUserLogued();
      this.http.get<any[]>(`${environment.baseUrl}/usuarios/chat`).subscribe(async usr => {
        for (const usuario of usr) {
          await this.join(usuario.userName, usrName);
          this.mapUsersChat.set(usuario.userName, []);
        }
      })
    });


    this.connection.on('NewMessage', (mensaje: NewMessage) => {
      if(mensaje.groupName === 'admin'){
        this.admin.next(true);
      }
      this.mensajesSubject.next(mensaje);
    });

  }


  getConnection() {
    return this.connection;
  }


  getMapUsersChat() {
    return this.mapUsersChat;
  }

  guardarMensaje(usuario: string, mensaje: NewMessage) {
    const chatUserMsj = this.mapUsersChat.get(usuario);
    chatUserMsj?.push(mensaje);
    if (chatUserMsj) {
      if (chatUserMsj.length >= 10) {
        chatUserMsj.shift();
      }
      this.mapUsersChat.set(usuario, chatUserMsj);
    }
  }

  public join(groupName: string, userName: string): Promise<void> {
    return this.connection.invoke('JoinGroup', groupName, userName)
      .then(_ => {
        true;
      });
  }

  public joinAdmin(user: string): Promise<void> {
    return this.connection.invoke('JoinGroup', 'admin', user)
      .then(_ => {
        console.log('conectado ',user);
        true;
      });
  }

  setEndSave() {
    // this.mapUsersChat = new Map();
    this.endSave = true;
  }

  resetEndSave() {
    this.endSave = false;
  }

  addAdminLogued(user: string){
    this.adminsLogued.add(user);
  }

  isAdminLogued(){
    return this.adminsLogued.size !== 0;
  }

  avisaAdmin(user: string){
      const newMessage: NewMessage = {
        message: '',
        userName: user,
        groupName: 'admin'
      };
  
      this.connection.invoke('SendMessage', newMessage)
        .then(_ =>'');
  }

 


}
