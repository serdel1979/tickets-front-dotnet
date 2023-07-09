import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ChatredisService } from '../../../services/chatredis.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-chatr-user',
  templateUrl: './chatr-user.component.html',
  styleUrls: ['./chatr-user.component.css']
})
export class ChatrUserComponent implements OnInit {


  messages: string[] = [];
  newMessage: string = '';

  selectedGroup: string | null = null;

  elemento: any;

  sound: any;

  groupName!: string;


  constructor(private chatService: ChatredisService, private authService: AuthService) {
    this.sound = new Audio('../../../../assets/sound/mensaje.mp3');
    const usrlog = this.authService.getUserLogued();
    this.chatService.onLoadMessages((usrlog,messages: string[]) => {
      this.messages = messages;
    });
  }


  // this.chatService.joinGroup(user).then(() => {
  //   this.chatService.onLoadMessages((messages: string[]) => {
  //     this.messages = messages;
  //     setTimeout(() => {
  //       this.elemento.scrollTop = this.elemento.scrollHeight;
  //     }, 30);
  //   });
  // })

 

  ngOnInit(): void {
    this.elemento = document.getElementById("messageList")
    const usrlog = this.authService.getUserLogued();
    this.chatService.joinGroup(usrlog).then();
    this.chatService.onLoadMessages((user,messages: string[]) => {
      this.messages = messages;
    })
    this.chatService.onReceiveMessage((groupReceive: string, messages: string[]) => {
      if(groupReceive == usrlog){
        this.messages = messages;
        this.sound.play();
      }
    });
  }

  getMessages(user: string) {
    console.log(user);
    this.chatService.joinGroup(user).then(() => {
      console.log('joingrup')
      this.chatService.onLoadMessages((user,messages: string[]) => {
        console.log(messages)
        this.messages = messages;
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 30);
      });
    })
  }

  sendMessage() {
    const now = new Date();
    const currentDateTime = now.toLocaleString();
    const userSendChat = this.authService.getUserLogued();
    const msj = `${userSendChat}: ${this.newMessage}            ${currentDateTime}`;
    this.chatService.sendMessage(msj)
      .then(() => {
        this.newMessage = '';
        this.getMessages(userSendChat);
      })
      .catch(error => console.error(error));
  }

}
