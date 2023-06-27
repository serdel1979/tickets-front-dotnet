import { Component, OnInit } from '@angular/core';
import { ChatredisService } from 'src/app/services/chatredis.service';
import { AuthService } from '../../../auth/auth.service';
import { UsuarioChat } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-chatr-admin',
  templateUrl: './chatr-admin.component.html',
  styleUrls: ['./chatr-admin.component.css']
})
export class ChatrAdminComponent implements OnInit{
  messages: string[] = [];
  newMessage: string = '';

  public usersChats: string[] = [];

  unreadMessages: { [key: string]: boolean } = {};
  newMessageIndicators: { [key: string]: boolean } = {};

  selectedUser!: string;

  selectedGroup: string | null = null;

  conversationId: string = '';

  groupName!: string;

  elemento: any;

  constructor( private chatService: ChatredisService, private authService: AuthService){}

  ngOnInit(): void {
    this.elemento = document.getElementById('messageList');
    this.authService.getAllUsers().subscribe((users)=>{
      this.usersChats = users.map((user: UsuarioChat) => user.userName);
    })
   this.chatService.onLoadMessages((messages: string[]) => {
      this.messages = messages;
    });

    //carga los mensajes cuando llegan
    this.chatService.onReceiveMessage((messages: string[]) => {
      this.messages = messages;
    });
  }



  getMessages(user: string) {
    console.log(user);
    this.chatService.joinGroup(user).then(()=>{
      this.chatService.onLoadMessages((messages: string[]) => {
        this.messages = messages;
        setTimeout(() => {
          console.log(`${this.elemento.scrollTop} ${this.elemento.scrollHeight}`);
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 30);
      });
    })
    
    // this.chatService.onLoadMessages(user).subscribe((messages) => {
    //   this.messages[user] = messages;
    //   if (user !== this.selectedUser) {
    //     this.newMessageIndicators[user] = true;
    //   }
    //   this.sound.play();
    //   setTimeout(() => {
    //     this.elemento.scrollTop = this.elemento.scrollHeight;
    //   }, 20);
    // });
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

  sendMessage(){
    this.chatService.sendMessage(this.newMessage)
    .then(() => {
      this.newMessage = ''
    })
    .catch(error => console.error(error));
  }


}
