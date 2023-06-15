import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatDataService {
  private chatListSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public chatList$: Observable<any[]> = this.chatListSubject.asObservable();

  constructor() { }

  public updateChatList(messages: any[]): void {
    this.chatListSubject.next(messages);
  }

  public getChatList(): any[] {
    return this.chatListSubject.value;
  }
}
