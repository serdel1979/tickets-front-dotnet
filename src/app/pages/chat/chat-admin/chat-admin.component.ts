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


  private mapUsersChat: Map<string, NewMessage[]> = new Map();

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
    private solicitudesService: SolicitudesService,
    private chatService: ChatService) {

    this.connection = this.chatService.getConnection();

    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;
    
  }

  ngOnInit(): void {
    this.chatService.mensajes$.subscribe((message: NewMessage) => {
      console.log(message);
      this.newMessage(message);
    });
    this.solicitudesService.getSolicitudes().subscribe(
      resp => {
        const departamentosUnicos = new Set<string>(); // Utilizamos un Set para almacenar departamentos únicos
        
        this.mapUsersChat = this.chatService.getMapUsersChat();
        this.userList = Array.from(departamentosUnicos); // Convertimos el Set en un array y lo asignamos a userList
      }
    )
    
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

  selectUserChat( nombre: string){ 
   // this.leave();
    if(this.userChatActual !== ''){
      this.mapUsersChat.set(this.userChatActual, this.conversation);
      this.conversation = [];
      if(this.mapUsersChat.get(nombre)){
         const chatUser = this.mapUsersChat.get(nombre);
         if(chatUser)this.conversation=chatUser;
      }
    }
    this.userChatActual = nombre;
    this.groupName = nombre;
    // this.join();
  }

  private newUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  private newMessage(message: NewMessage) {
    if (message.message === '***') {
      console.log(this.conversation);
      if(message.userName !== this.authService.getUserLogued() &&(this.userChatActual === message.userName)){
        this.isTyping = true;
        this.resetIsTyping();
      }
    } else {
      if(this.userChatActual !== message.userName && this.userName !== message.userName){
        console.log(this.conversation);
        const chatUserMsj = this.mapUsersChat.get(message.userName);
        chatUserMsj?.push(message);
        if(chatUserMsj)this.mapUsersChat.set(message.userName,chatUserMsj);
      }else{
        if (this.conversation.length >= 10) {
          this.conversation.shift(); // Elimina el primer elemento
        }
        const chatUserMsj = this.mapUsersChat.get(message.userName);
        chatUserMsj?.push(message);
        if(chatUserMsj)this.mapUsersChat.set(message.userName,chatUserMsj);
        this.conversation.push(message);
        this.messageToSend = '';
        this.isTyping = false;
        this.messageInput.nativeElement.focus();
        console.log(this.conversation);
      }      
    }
  }

  public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }

  private leftUser(message: string) {
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  public join() {
    this.connection.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
      });
  }

  isSelectedUser(user:string): boolean{
    return user===this.userChatActual;
  }

}
