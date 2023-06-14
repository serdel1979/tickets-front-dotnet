import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NewMessage } from '../interfaces/messages.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Observable, Subject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public mapUsersChat: Map<string, NewMessage[]> = new Map();


  private adminsLogued: Set<string> = new Set();

  public userList: string[] = [];

  public connection: HubConnection;

  private puedeGuardar: boolean = true;

  private mensajesSubject = new Subject<any>();

  private admin = new Subject<boolean>();

  mensajes$: Observable<NewMessage> = this.mensajesSubject.asObservable();
  adminConnect$: Observable<boolean> = this.admin.asObservable();


  constructor(private http: HttpClient, private authService: AuthService) {
    this.connection = new HubConnectionBuilder()
      .withUrl(environment.urlHub)
      .build();
    this.connection.start().then(async () => {
      //const usrName = this.authService.getUserLogued();
    });
    this.connection.on('NewMessage', (mensaje: NewMessage) => {
      if (mensaje.groupName === 'admin') {
        this.admin.next(true);
      }
      this.mensajesSubject.next(mensaje);
    });

  }

  async initUsersChat(userName: string){
    this.http.get<any[]>(`${environment.baseUrl}/usuarios/chat/${userName}`).subscribe(async usr => {
      for (const usuario of usr) {
          await this.join(usuario.userName, userName);
          this.mapUsersChat.set(usuario.userName, []);
      }
    })
  }

  getConnection() {
    return this.connection;
  }


  getMapUsersChat() {
    return this.mapUsersChat;
  }

  guardarMensaje(usuario: string, mensaje: NewMessage) {
    console.log(`${mensaje.userName} ${mensaje.message}`);
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
        this.admin.next(true);
        true;
      });
  }

  setPuedeGuardar() {
    this.puedeGuardar = true;
  }

  puedeEnviar() {
    return this.puedeGuardar;
  }

  setNoPuedeGuardar() {
    this.puedeGuardar = false;
  }

  addAdminLogued(user: string) {
    this.adminsLogued.add(user);
  }

  isAdminLogued() {
    return this.adminsLogued.size !== 0;
  }





}
