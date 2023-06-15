import { Component, OnInit } from '@angular/core';
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


  constructor(private chatService: ChatService, private  authService: AuthService){}

  ngOnInit(): void {
      // Iniciar la conexión al hub cuando se inicializa el componente

    this.groupName = this.authService.getUserLogued();

    this.chatService.startConnection();

    // Unirse al grupo del chat
    this.chatService.addToGroup(this.groupName,'musica');

    // Escuchar los eventos de nuevos mensajes y actualizar la lista de chat
    this.chatService.onNewMessage().subscribe((newMessage: any) => {
      this.chatList.push(newMessage);
    });
  }

  sendMessage(): void {
    if (this.message.trim() !== '') {
      this.chatService.sendToGroup(this.groupName, this.message);
      this.message = ''; // Limpiar el campo de mensaje después de enviarlo
    }
  }

  connect(){
    this.chatService.addToGroup(this.groupName,this.authService.getUserLogued());
  }
}
