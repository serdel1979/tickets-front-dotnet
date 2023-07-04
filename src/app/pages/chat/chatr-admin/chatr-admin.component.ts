import { Component, OnInit } from '@angular/core';
import { ChatredisService } from 'src/app/services/chatredis.service';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioChat } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-chatr-admin',
  templateUrl: './chatr-admin.component.html',
  styleUrls: ['./chatr-admin.component.css']
})
export class ChatrAdminComponent implements OnInit {
  messages: string[] = [];
  newMessage: string = '';

  public usersChats: string[] = [];

  unreadMessages: { [key: string]: boolean } = {};
  newMessageIndicators: { [key: string]: boolean } = {};

  selectedUser!: string;

  selectedGroup: string | null = null;

  conversationId: string = '';

  groupName!: string;

  groupRecepcion!: string;

  elemento: any;

  constructor(private chatService: ChatredisService, private authService: AuthService) { }

  ngOnInit(): void {
    this.elemento = document.getElementById('messageList');
    this.authService.getAllUsers().subscribe((users) => {
      this.usersChats = users.map((user: UsuarioChat) => user.userName);
    })
    this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });

    //carga los mensajes cuando llegan
    this.chatService.onReceiveMessage((groupReceive: string, messages: string[]) => {
      if (this.selectedUser === groupReceive) {
        this.messages = messages;
      }
      this.groupRecepcion = groupReceive;
    });
  }



  getMessages(user: string) {
    console.log(user);
    this.chatService.joinGroup(user).then(() => {
      this.chatService.onLoadMessages((messages: string[]) => {
        this.messages = messages;
        console.log(`${user} ${this.messages}`);
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 30);
      });
    })
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

  deletChat() {
    this.chatService.deleteGroupMessages(this.conversationId)
      .then((msjs) => this.messages = msjs)
      .catch((err) => console.error(err));
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
