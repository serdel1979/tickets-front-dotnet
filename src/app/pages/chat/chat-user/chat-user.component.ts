import { Component, OnInit } from '@angular/core';
import { ChatDataService } from 'src/app/services/chat-data.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from '../../../auth/auth.service';
import { ChatFirebaseService } from '../../../services/chat-firebase.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit{
  // groupName: string = 'nombre-del-grupo';
  // message: string = '';
  // chatList: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  conversationId: string = 'CONVERSATION_ID'; // Reemplaza con el identificador de la conversación actual


  constructor(private chatService: ChatFirebaseService){}

  ngOnInit(): void {
    this.chatService.getConversationMessages(this.conversationId).subscribe((messages) => {
      this.messages = messages;
    }); 
  }


  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim() !== '') {
      const message = {
        sender: 'SENDER_ID', // Reemplaza con el ID del remitente actual
        content: this.newMessage,
        timestamp: Date.now(),
      };
      this.chatService.addMessageToConversation(this.conversationId, message);
      this.newMessage = '';
    }
  }

  
  



}
