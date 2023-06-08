import { Component, ElementRef, ViewChild, OnInit, NgZone } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

const URLHub = environment.urlHub;

interface NewMessage {
  userName: string;
  message: string;
  groupName?: string;
}



@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit {


  isTyping: boolean = false;

  message: string = '';
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;
  messages: string[] = [];

  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
    userName: 'Sistema'
  }];

  private connection: HubConnection;
  constructor(private authService: AuthService, private ngZone: NgZone) {
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

    this.connection.on("NewUser", message => this.newUser(message));
    this.connection.on("NewMessage", message => this.newMessage(message));
    this.connection.on("LeftUser", message => this.leftUser(message));
  }

  ngOnInit(): void {
    this.userName = this.authService.getUserLogued();
    this.groupName = this.userName;
    this.connection.start()
      .then(() => {
        console.log('Connection Started');
        this.connection.invoke('JoinGroup', 'musica', this.userName)
          .then(_ => {
            this.joined = true;
          });
      }).catch((error: any) => {
        return console.error(error);
      });
  }




  public sendMessage() {
    const newMessage: NewMessage = {
      message: this.messageToSend,
      userName: this.userName,
      groupName: 'musica'
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
      groupName: 'musica'
    };

    this.connection.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = this.messageToSend);
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
      if(message.userName !== this.authService.getUserLogued()){
        this.isTyping = true;
        this.resetIsTyping();
      }
    } else {
      if (this.conversation.length >= 10) {
        this.conversation.shift(); // Elimina el primer elemento
      }
      this.conversation.push(message);
      this.messageToSend = '';
      this.isTyping = false;
      this.messageInput.nativeElement.focus();
    }
  }

  private leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

}
