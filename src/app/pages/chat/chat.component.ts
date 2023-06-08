import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public isAdmin!: boolean;


  constructor(private authService: AuthService){}
  
  ngOnInit(): void {
    this.isAdmin= this.authService.isAdmin();  
  }

}
