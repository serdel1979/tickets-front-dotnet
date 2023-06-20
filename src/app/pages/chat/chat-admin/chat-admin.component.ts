import { Component, OnInit } from '@angular/core';
import { ChatFirebaseService } from '../../../services/chat-firebase.service';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioChat } from 'src/app/interfaces/usuario.interface';
@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit {

  // groupName: string = 'nombre-del-grupo';
  // message: string = '';
  // chatList: any[] = [];

  messages: { [key: string]: any[] } = {};
  newMessage: string = '';
  conversationId: string = ''; // Reemplaza con el identificador de la conversación actual
  currentUser: string = '';
  selectedItemIndex: number = -1;

  selectedUser!: string;

  sound: any;
  
  unreadMessages: { [key: string]: boolean } = {};

  public usersChats: string[] = [];

  elemento: any;


  constructor(private chatService: ChatFirebaseService, private authService: AuthService) {
    this.sound = new Audio('../../../../assets/sound/mensaje.mp3');
  }

  async ngOnInit(): Promise<void> {
    this.elemento = document.getElementById('messageList');
    this.currentUser = this.authService.getUserLogued();
    this.authService.getAllUsers().subscribe((users) => {
      this.usersChats = users.map((user: UsuarioChat) => user.userName);
      this.updateUnreadMessages();
    });
    if (this.selectedUser) {
      await this.getMessages(this.selectedUser);
    }
  }


  updateUnreadMessages() {
    this.usersChats.forEach((user) => {
      this.chatService.getConversationMessages(user).subscribe((messages) => {
        if (user !== this.selectedUser) {
          this.unreadMessages[user] = messages.length > 0;
        }
      });
    });
  }
  

  getMessages(user: string) {
    this.chatService.getConversationMessages(user).subscribe((messages) => {
      this.messages[user] = messages;
      this.sound.play();
      this.unreadMessages[user] = true; // Marcar el usuario con mensajes no leídos
  
      // Desmarcar el usuario seleccionado actualmente
      if (this.selectedUser !== user) {
        this.unreadMessages[this.selectedUser] = false;
      }
  
      this.selectedUser = user; // Actualizar el usuario seleccionado
      this.conversationId = user;
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);
    });
  }


  deletChat() {
    this.chatService.deletConversationMessages(this.conversationId);
  }

  sendMessage(): void {
    if (this.newMessage && this.newMessage.trim() !== '') {
      const message = {
        sender: this.authService.getUserLogued(),
        content: this.newMessage,
        timestamp: Date.now(),
      };
      this.chatService.addMessageToConversation(this.conversationId, message);
      this.newMessage = '';
    }
  }



  selectUserChat(usr: string) {
    this.selectedUser = usr;
    this.conversationId = usr;
    this.getMessages(this.conversationId);
  }


}
