import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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
  constructor(private authService: AuthService){
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
    .then(()=> {
      console.log('Connection Started');
      this.connection.invoke('JoinGroup', 'musica' , this.userName)
      .then(_ => {
        this.joined = true;
      });
    }).catch((error:any) => {
      return console.error(error);
    });
  }



  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch(err) { }
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

 
  onTyping(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isTyping = input.value.trim() !== '';

    this.connection.invoke('NotifyTyping', this.isTyping)
      .catch(error => {
        console.error('Error al enviar señal de escritura a SignalR: ' + error);
      });
  }



  private newUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  private newMessage(message: NewMessage) {
    console.log(message.message);
    if (this.conversation.length >= 10) {
      this.conversation.shift(); // Elimina el primer elemento
    }
    this.conversation.push(message);
    this.messageToSend = '';
    this.messageInput.nativeElement.focus();
  }

  private leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

}
