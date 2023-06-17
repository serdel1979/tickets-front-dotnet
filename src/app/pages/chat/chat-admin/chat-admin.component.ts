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
      this.groupName = 'musica';

      if(!this.chatService.connected()){
        this.chatService.startConnection()
        .then(()=>{
          this.chatService.addToGroup('musica', this.authService.getUserLogued());
        })
        .catch((err)=>console.error(err));
      }
      
      this.chatList = this.chatDataService.getChatList();

      this.chatService.onNewMessage().subscribe((newMessage: any) => {
        this.chatList = this.chatDataService.getChatList();
      });
  }


  sendMessage(): void {
    if (this.message.trim() !== '') {
      this.chatService.sendToGroup(this.groupName, this.message);
      this.message = '';
    }
  }

  

}
