import { Component, OnInit } from '@angular/core';
import { ChatDataService } from 'src/app/services/chat-data.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit{
  groupName: string = 'nombre-del-grupo';
  message: string = '';
  chatList: any[] = [];


  constructor(private chatService: ChatService, private  authService: AuthService,  private chatDataService: ChatDataService){}

  ngOnInit(): void {
    this.groupName = 'musica';
    this.chatService.startConnection();
    
    // Obtener los mensajes existentes desde el ChatDataService
    this.chatList = this.chatDataService.getChatList();

    this.chatService.onNewMessage().subscribe((newMessage: any) => {
      console.log(newMessage);
      this.chatList = this.chatDataService.getChatList();
    });
  }


  sendMessage(): void {
    if (this.message.trim() !== '') {
      this.chatService.sendToGroup(this.groupName, this.message);
      this.message = '';
    }
  }

  connect(){
    this.chatService.addToGroup(this.groupName, this.authService.getUserLogued());
    this.chatList = this.chatDataService.getChatList();
  }

  



}
