import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from '../../services/chat.service';
import { NewMessage } from 'src/app/interfaces/messages.interface';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {


  public isAdmin: boolean = false;

  public userName: string = '';
  constructor(private authService: AuthService, private chatService: ChatService) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userName = this.authService.getUserLogued();
    //if (this.isAdmin && this.chatService.puedeEnviar()) {
    this.chatService.initUsersChat(this.userName);
    this.chatService.mensajes$.subscribe((message: NewMessage) => {
      console.log(`${message.userName} ${message.message}`);
      if (message.message !== '***' && this.chatService.puedeEnviar()) {
        console.log(`${message.userName} ${message.message} desp de if`);
        this.chatService.guardarMensaje(message.userName, message);
      }
    });
    //}
  }

  // private newMessage(message: NewMessage) {
  //   // if (message.message !== '***') {
  //   //   const puede = this.chatService.puedeEnviar();
  //   //   if (puede) {
  //   this.chatService.guardarMensaje(message.userName, message);
  //   //   }
  //   // }
  // }


}
