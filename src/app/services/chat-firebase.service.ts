import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatFirebaseService {

  private conversationsRef: AngularFireList<any>;

  newMessageIndicators: { [key: string]: boolean } = {};

  constructor(private db: AngularFireDatabase, private authService: AuthService) { 
        this.conversationsRef = this.db.list('/conversations');
  }

  hasNewMessages(conversationId: string): Observable<boolean> {
    return this.db
      .list(`/conversations/${conversationId}/messages`)
      .valueChanges()
      .pipe(
        filter((messages) => messages.some((message:any) => message.sender !== this.authService.getUserLogued)),
        map((messages) => messages.length > 0)
      );
  }

  getConversationMessages(conversationId: string): Observable<any[]> {
    return this.db.list(`/conversations/${conversationId}/messages`).valueChanges();
  }

  deletConversationMessages(conversationId: string) {
     this.db.list(`/conversations/${conversationId}/messages`).remove();
  }

  addMessageToConversation(conversationId: string, message: any): void {
    this.db.list(`/conversations/${conversationId}/messages`).push(message);
  }


}
