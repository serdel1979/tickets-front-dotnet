import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  message: string = '';
  @ViewChild('messageInput') messageInput!: ElementRef;
  @ViewChild('messageList') messageList!: ElementRef;
  messages: string[] = [];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch(err) { }
  }


  sendMessage() {
    if (this.message) {
      if (this.messages.length >= 10) {
        this.messages.shift(); // Elimina el primer elemento
      }
      this.messages.push(this.message);
      this.message = '';
      this.scrollToBottom();
      this.messageInput.nativeElement.focus();
    }
  }

}
