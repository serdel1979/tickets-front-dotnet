import { Component, OnInit } from '@angular/core';
import { ChatDataService } from 'src/app/services/chat-data.service';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-chat-admin',
  templateUrl: './chat-admin.component.html',
  styleUrls: ['./chat-admin.component.css']
})
export class ChatAdminComponent implements OnInit{

  groupName: string = 'nombre-del-grupo';
  message: string = '';
  chatList: any[] = [];


  constructor(private chatService: ChatService, private authService:AuthService,  private chatDataService: ChatDataService){}

  ngOnInit(): void {
  //     // Iniciar la conexión al hub cuando se inicializa el componente
  //   this.groupName = 'musica'
  //   this.chatService.startConnection();

  //   // Unirse al grupo del chat
  //  // this.chatService.addToGroup(this.groupName,'soporte');

  //   // Escuchar los eventos de nuevos mensajes y actualizar la lista de chat
  //   this.chatService.onNewMessage().subscribe((newMessage: any) => {
  //     this.chatList = this.chatService.getMessages(); 
  //   });
      this.groupName = 'musica';
      this.chatService.startConnection();
      
      // Obtener los mensajes existentes desde el ChatDataService
      this.chatList = this.chatDataService.getChatList();

      this.chatService.onNewMessage().subscribe((newMessage: any) => {
        this.chatList = this.chatDataService.getChatList();
      });
  }

  // sendMessage(): void {
  //   if (this.message.trim() !== '') {
  //     this.chatService.sendToGroup(this.groupName, this.message);
  //     this.message = ''; // Limpiar el campo de mensaje después de enviarlo
  //   }
  // }
  sendMessage(): void {
    if (this.message.trim() !== '') {
      this.chatService.sendToGroup(this.groupName, this.message);
      this.message = '';
    }
  }

  connect(){
    this.chatService.addToGroup(this.groupName, 'soporte');
    this.chatList = this.chatDataService.getChatList();
  }


}
