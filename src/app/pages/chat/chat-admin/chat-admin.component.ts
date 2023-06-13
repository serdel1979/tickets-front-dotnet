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
    this.userList = Array.from(this.mapUsersChat.keys());
    this.inicializaCantidadMensajes();

    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;

  }

  ngOnInit(): void {
    this.chatService.setNoPuedeGuardar();
    this.mapUsersChat = this.chatService.getMapUsersChat();
    console.log(this.mapUsersChat);
    this.chatService.mensajes$.subscribe((message: NewMessage) => {
      this.newMessage(message);
    });
  }

  ngOnDestroy(): void {
    this.chatService.setPuedeGuardar();
  }

  inicializaCantidadMensajes() {
    for (const key of this.mapUsersChat.keys()) {
      const messages = this.mapUsersChat.get(key); // Obtener el array NewMessage correspondiente a la clave
      const messageCount = messages ? messages.length : 0; // Obtener la cantidad de elementos en el array o 0 si no existe

      this.cantMsgChat.set(key, messageCount); // Asignar la cantidad al mapa cantMsgChat
    }
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
    this.cantMsgChat.set(nombre, 0);
    this.userChatActual = nombre;
    this.groupName = nombre;
  }

  incrementarCantidadDeMensajes(clave: string) {
    const valorActual = this.cantMsgChat.get(clave);
    if (valorActual !== undefined) {
      const nuevoValor = valorActual + 1;
      this.cantMsgChat.set(clave, nuevoValor);
    }
  }

  private newMessage(message: NewMessage) {
    if (message.message === '***') {
      if (message.userName !== this.authService.getUserLogued() && (this.userChatActual === message.userName)) {
        this.isTyping = true;
        this.resetIsTyping();
      }
    } else {
        this.chatService.guardarMensaje(this.userChatActual, message);
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
