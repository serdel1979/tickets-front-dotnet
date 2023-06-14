import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { NewMessage } from 'src/app/interfaces/messages.interface';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { ChatService } from '../../../services/chat.service';


const URLHub = environment.urlHub;




@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {



  public misChats: NewMessage[] | undefined = [];

  isTyping: boolean = false;
  message: string = '';
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;

  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] | undefined = [];

  public adminConnect: boolean = true;

  private connection: HubConnection;


  constructor(private authService: AuthService, private ngZone: NgZone, private chatService: ChatService) {
    this.connection = this.chatService.getConnection();
    this.misChats = this.chatService.getMisChats();
    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;
  }

  ngOnInit(): void {
    this.chatService.setNoPuedeGuardar();
    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;
    this.misChats = this.chatService.getMisChats();
    console.log('ms chats',this.misChats);
    this.chatService.mensajes$.subscribe((message: NewMessage) => {
      this.newMessage(message);
    });
  }

  ngOnDestroy(): void {
    this.chatService.setPuedeGuardar();
  }


  messages: string[] = [];





  public sendMessage() {
    
    const newMessage: NewMessage = {
      message: this.messageToSend,
      userName: this.userName,
      groupName: this.groupName
    };
    console.log('envíaa',newMessage);
    this.connection.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = this.messageToSend);
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




  resetIsTyping() {
    this.ngZone.run(() => {
      setTimeout(() => {
        this.isTyping = false;
      }, 2000); // 4 segundos (4000 milisegundos)
    });
  }


  private newMessage(message: NewMessage) {
    if (message.message === '***') {
      if (message.userName !== this.authService.getUserLogued()) {
        this.isTyping = true;
        this.resetIsTyping();
      }
    } else {
      // if (this.conversation && this.conversation.length >= 10) {
      //   this.conversation.shift(); // Elimina el primer elemento
      // }
      //if(this.conversation) this.conversation.push(message);
      this.chatService.guardarMensaje(this.userName, message);
      
      this.messageToSend = '';
      this.isTyping = false;
      this.messageInput.nativeElement.focus();
    }
  }





}
