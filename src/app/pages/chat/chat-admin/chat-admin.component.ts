import { Component, ElementRef, ViewChild, OnInit, NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from 'src/app/auth/auth.service';
import { NewMessage } from 'src/app/interfaces/messages.interface';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../../services/chat.service';
import { mergeNsAndName } from '@angular/compiler';





@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit {


  public mapUsersChat: Map<string, NewMessage[]> = new Map();
  public cantMsgChat: Map<string, number> = new Map();

  public userList: string[] = [];

  public userChatActual: string = '';

  isTyping: boolean = false;

  message: string = '';
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;
  messages: string[] = [];

  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [];

  private connection: HubConnection;
  constructor(private authService: AuthService, private ngZone: NgZone,
    private chatService: ChatService) {

    this.connection = this.chatService.getConnection();

    this.mapUsersChat = this.chatService.getMapUsersChat();

    this.chatService.setEndSave();

    this.userList = Array.from(this.mapUsersChat.keys());
    for (const key of this.mapUsersChat.keys()) {
      const messages = this.mapUsersChat.get(key); // Obtener el array NewMessage correspondiente a la clave
      const messageCount = messages ? messages.length : 0; // Obtener la cantidad de elementos en el array o 0 si no existe

      this.cantMsgChat.set(key, messageCount); // Asignar la cantidad al mapa cantMsgChat
    }

    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;

  }

  ngOnInit(): void {
    this.chatService.mensajes$.subscribe((message: NewMessage) => {
      this.newMessage(message);
    });
  }


  getCantMsgChatValue(key: string): number {
    if (this.cantMsgChat.has(key)) {
      const cant = this.cantMsgChat.get(key);
      if (cant && cant > 0) {
        return cant;
      }
    }
    return 0;
  }


  public sendMessage() {
    const newMessage: NewMessage = {
      message: this.messageToSend,
      userName: this.userName,
      groupName: this.groupName
    };

    this.connection.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = '');
  }




  resetIsTyping() {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.isTyping = false;
      }, 2000); // 4 segundos (4000 milisegundos)
    });
  }


  onTyping(event: Event) {
    const newMessage: NewMessage = {
      message: '***',
      userName: this.userName,
      groupName: this.groupName
    };

    this.connection.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = this.messageToSend);
  }

  selectUserChat(nombre: string) {
    // this.leave();
    // if (this.mapUsersChat.get(nombre)) {
    //   const chatUser = this.mapUsersChat.get(nombre);
    // }
    this.cantMsgChat.set(nombre, 0);

    //cuando llega msj incrementar
    // const valorActual = this.cantMsgChat.get(nombre);
    // if (valorActual !== undefined) {
    //   const nuevoValor = valorActual + 1;
    //   this.cantMsgChat.set(nombre, nuevoValor);
    // }

    // if (this.userChatActual !== '') {
    //   this.mapUsersChat.set(this.userChatActual, this.conversation);
    //   this.conversation = [];
    //   if (this.mapUsersChat.get(nombre)) {
    //     const chatUser = this.mapUsersChat.get(nombre);
    //     if (chatUser) this.conversation = chatUser;
    //   }
    // }
    this.userChatActual = nombre;
    this.groupName = nombre;
    // this.join();
  }


  private newMessage(message: NewMessage) {
    if (message.message === '***') {
      if (message.userName !== this.authService.getUserLogued() && (this.userChatActual === message.userName)) {
        this.isTyping = true;
        this.resetIsTyping();
      }
    } else {
      if (this.userName === message.userName) { //si el usuario es
        const chatUserMsj = this.mapUsersChat.get(this.userChatActual);
        chatUserMsj?.push(message);
        if (chatUserMsj) {
          if (chatUserMsj.length >= 10) {
            chatUserMsj.shift();
          }
          this.mapUsersChat.set(this.userChatActual, chatUserMsj);
        }
      }else{
        const chatUserMsj = this.mapUsersChat.get(message.userName);
        chatUserMsj?.push(message);
        if (chatUserMsj) {
          if (chatUserMsj.length >= 10) {
            chatUserMsj.shift();
          }
          this.mapUsersChat.set(message.userName, chatUserMsj);
        }
      }
      this.messageToSend = '';
      this.isTyping = false;
      this.messageInput.nativeElement.focus();
    }
  }

  public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }


  public join() {
    this.connection.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
      });
  }

  isSelectedUser(user: string): boolean {
    return user === this.userChatActual;
  }

}
