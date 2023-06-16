import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ChatService } from '../../services/chat.service';
import { NewMessage } from 'src/app/interfaces/messages.interface';
import { ChatDataService } from 'src/app/services/chat-data.service';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {


  public isAdmin: boolean = false;

  public userName: string = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userName = this.authService.getUserLogued();
  }



}
