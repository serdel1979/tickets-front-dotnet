import { Component, OnInit } from '@angular/core';
import { ChatFirebaseService } from '../../../services/chat-firebase.service';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioChat } from 'src/app/interfaces/usuario.interface';
@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit{

  // groupName: string = 'nombre-del-grupo';
  // message: string = '';
  // chatList: any[] = [];

  messages: any[] = [];
  newMessage: string = '';
  conversationId: string = ''; // Reemplaza con el identificador de la conversación actual
  currentUser: string = '';
  selectedItemIndex: number = -1;

  public usersChats: UsuarioChat[] = [];
  public usersLoaded: boolean = false;



  constructor( private chatService: ChatFirebaseService, private authService: AuthService){}

  ngOnInit(): void {
    this.currentUser = this.authService.getUserLogued();
    this.authService.getAllUsers().subscribe((users)=>{
      this.usersChats = users;
      this.usersLoaded = true;
    })
    this.chatService.getConversationMessages('musica').subscribe((messages) => {
      this.messages = messages;
    }); 
  }


  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim() !== '') {
      const message = {
        sender: this.authService.getUserLogued(), 
        content: this.newMessage,
        timestamp: Date.now(),
      };
      this.chatService.addMessageToConversation('musica', message);
      this.newMessage = '';
    }
  }

  selectItem(index: number) {
    this.selectedItemIndex = index;
  }
  

}
