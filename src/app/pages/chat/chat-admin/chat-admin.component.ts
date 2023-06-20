import { Component, OnInit } from '@angular/core';
import { ChatFirebaseService } from '../../../services/chat-firebase.service';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioChat } from 'src/app/interfaces/usuario.interface';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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
  newMessageIndicators: { [key: string]: boolean } = {};

  public usersChats: string[] = [];

  elemento: any;


  constructor(private chatService: ChatFirebaseService,
    private authService: AuthService,
    private localStorageService: LocalStorageService) {

    this.sound = new Audio('../../../../assets/sound/mensaje.mp3');

    this.newMessageIndicators = this.localStorageService.getItem('Indicators') || {};
  }

  async ngOnInit(): Promise<void> {
    this.elemento = document.getElementById('messageList');
    this.currentUser = this.authService.getUserLogued();
    this.authService.getAllUsers().subscribe((users) => {
      this.usersChats = users.map((user: UsuarioChat) => user.userName);
      this.usersChats.forEach((user) => {
        this.chatService.hasNewMessages(user).subscribe((hasNewMessages) => {
          this.newMessageIndicators[user] = hasNewMessages;
        });
      });

    });
    if (this.selectedUser) {
      await this.getMessages(this.selectedUser);
    }

  }





  getMessages(user: string) {
    this.chatService.getConversationMessages(user).subscribe((messages) => {
      this.messages[user] = messages;
      if (user !== this.selectedUser) {
        this.newMessageIndicators[user] = true;
      }
      this.sound.play();
      setTimeout(() => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      }, 20);

      // Guardar newMessageIndicators en el almacenamiento local
      //this.localStorageService.setItem('Indicators', this.newMessageIndicators);
    });
  }

  ngOnDestroy() {
    this.localStorageService.setItem('Indicators', this.newMessageIndicators);
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
    console.log('lll')
  }



  selectUserChat(usr: string) {
    this.selectedUser = usr;
    this.conversationId = usr;

    // Restablecer el indicador del usuario seleccionado
    this.newMessageIndicators[usr] = false;

    // Guardar newMessageIndicators actualizado en el almacenamiento local
    //this.localStorageService.setItem('Indicators', this.newMessageIndicators);

    this.getMessages(this.conversationId);
  }


}
