import { Component, OnInit, inject } from '@angular/core';
import { ChatFirebaseService } from '../../../services/chat-firebase.service';
import { Observable } from 'rxjs';
import { Firestore } from 'firebase/firestore';
import { collectionData, collection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/auth/auth.service';

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



  constructor(private chatService: ChatFirebaseService, private authService: AuthService){}

  ngOnInit(): void {
    this.conversationId = this.authService.getUserLogued();
    this.chatService.getConversationMessages(this.conversationId).subscribe((messages) => {
      this.messages = messages;
    }); 
  }


  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim() !== '') {
      const message = {
        sender: this.conversationId, // Reemplaza con el ID del remitente actual
        content: this.newMessage,
        timestamp: Date.now(),
      };
      this.chatService.addMessageToConversation(this.conversationId, message);
      this.newMessage = '';
    }
  }

  
  



}
