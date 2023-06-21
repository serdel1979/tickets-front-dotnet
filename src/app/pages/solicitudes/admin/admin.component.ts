import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../../services/chat.service';


const URLHub = environment.urlHub;

interface NewMessage {
  userName: string;
  message: string;
  groupName?: string;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
    userName: 'Sistema'
  }];
  private connection: HubConnection;

  public isLogued: boolean = false;
  public page!: number;
  
  sound: any; 

  public solicitudes!: Solicitud[];

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService) {
    
    this.sound = new Audio('../../../../assets/sound/solicitud.mp3');
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

      this.connection.on("NewUser", message => this.newUser(message));
      this.connection.on("NewMessage", () => this.refresh(true));
      this.connection.on("LeftUser", message => this.leftUser(message));
  }

   ngOnInit(): void {
    this.connection.start().then(() => {
      // La conexión se ha establecido correctamente
       //------------------
       this.connection.invoke('JoinGroup', 'refresh', 'soporte')
       .then(_ => {
         this.joined = true;
       });
       //------------------

    }).catch(err => {
      console.error(err.toString());
    });
    this.refresh(false);
  }

  loadDynamicComponent() {
    this.router.navigate([`/chat`]);
  }

  async refresh(flag: boolean) {
    if(flag)this.sound.play();
    this.isLogued = this.authService.isLogued();
    this.userName = this.authService.getUserLogued();
    if (this.isLogued) {
      this.solicitudesService.getSolicitudes().subscribe(async resp => {
        this.solicitudes = resp;
      })
    }
  }

  onPageChange(event: any) {
    this.page = event;
  }

  verSolicitud(id: number) {
    this.router.navigate([`/solicitudes/ver/${id}`]);
  }


  public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }

  private newUser(message: string) {
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  private newMessage(message: NewMessage) {
    console.log(message);
    this.conversation.push(message);
  }

  private leftUser(message: string) {
    console.log(message);
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }


  getColorStyles(estado: string) {
    switch (estado) {
      case 'CERRADO':
      return { color: 'black', 'font-weight': 'bold' };
    case 'Solucionado':
      return { color: 'green', 'font-weight': 'bold' };
    case 'PENDIENTE':
      return { color: 'red', 'font-weight': 'bold' };
    case 'Visto':
      return { color: 'brown', 'font-weight': 'bold' };
    default:
      return { 'font-weight': 'bold' };
    }
  }

  public join() {
    this.connection.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
      });
  }

}
