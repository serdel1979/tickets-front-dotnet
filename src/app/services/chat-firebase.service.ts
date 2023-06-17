import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatFirebaseService {

  private conversationsRef: AngularFireList<any>;

  constructor(private db: AngularFireDatabase) { 
        this.conversationsRef = this.db.list('/conversations');
  }


  getConversationMessages(conversationId: string): Observable<any[]> {
    return this.db.list(`/conversations/${conversationId}/messages`).valueChanges();
  }

  addMessageToConversation(conversationId: string, message: any): void {
    this.db.list(`/conversations/${conversationId}/messages`).push(message);
  }


}
