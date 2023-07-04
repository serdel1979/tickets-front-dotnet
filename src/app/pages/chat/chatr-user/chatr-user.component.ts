import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatredisService } from '../../../services/chatredis.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-chatr-user',
  templateUrl: './chatr-user.component.html',
  styleUrls: ['./chatr-user.component.css']
})
export class ChatrUserComponent implements OnInit, AfterViewInit {


  messages: string[] = [];
  newMessage: string = '';

  selectedGroup: string | null = null;


  sound: any;

  groupName!: string;

  groupRecepcion!: string;

  constructor(private chatService: ChatredisService, private authService: AuthService) {
    this.sound = new Audio('../../../../assets/sound/mensaje.mp3');
    this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });
  }



  ngAfterViewInit(): void {
    this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });
  }

  ngOnInit(): void {
    this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });
    //carga los mensajes cuando llegan
    this.chatService.onReceiveMessage((groupReceive: string, messages: string[]) => {
      this.groupRecepcion = groupReceive;
      this.messages = messages;
      if(groupReceive != this.selectedGroup){
        this.sound.play();
      }
    });
  }


  sendMessage() {
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    const userSendChat = this.authService.getUserLogued();
    const msj = `${userSendChat}: ${this.newMessage}            ${currentDateTime}`;
    this.chatService.sendMessage(msj)
      .then(() => {
        this.newMessage = ''
      })
      .catch(error => console.error(error));
  }

}
