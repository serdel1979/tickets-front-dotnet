import { Component, OnInit } from '@angular/core';
import { ChatredisService } from '../../../services/chatredis.service';

@Component({
  selector: 'app-chatr-user',
  templateUrl: './chatr-user.component.html',
  styleUrls: ['./chatr-user.component.css']
})
export class ChatrUserComponent implements OnInit {


  messages: string[] = [];
  newMessage: string = '';

  selectedGroup: string | null = null;

  groupName!: string;

  groupRecepcion!: string;

  constructor( private chatService: ChatredisService){}

  ngOnInit(): void {
   this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });

    //carga los mensajes cuando llegan
    this.chatService.onReceiveMessage((groupReceive: string, messages: string[]) => {
      this.groupRecepcion = groupReceive;
      this.messages = messages;
    });
  }


  sendMessage(){
    this.chatService.sendMessage(this.newMessage)
    .then(() => {
      this.newMessage = ''
    })
    .catch(error => console.error(error));
  }

}
