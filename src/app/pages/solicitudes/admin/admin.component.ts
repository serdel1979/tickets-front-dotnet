import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { url } from 'inspector';


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


  public isLogued: boolean = false;
  public page!: number;
  private connection: HubConnection;
  public solicitudes!: Solicitud[];

  constructor(private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router) {
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

      this.connection.on("NewUser", message => this.newUser(message));
      this.connection.on("NewMessage", message => this.refresh());
      this.connection.on("LeftUser", message => this.leftUser(message));
  }

   ngOnInit(): void {
    this.connection.start().then(() => {
      // La conexión se ha establecido correctamente
      console.log("conexión socket ok...");
       //------------------
       this.connection.invoke('JoinGroup', 'refresh', 'soporte')
       .then(_ => {
         this.joined = true;
       });
       //------------------

    }).catch(err => {
      console.error(err.toString());
    });
    this.refresh();
  }


  async refresh() {
    console.log("haciendo refresh");
    this.isLogued = this.authService.isLogued();
    if (this.isLogued) {
      this.solicitudesService.getSolicitudes().subscribe(resp => {
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
    console.log(message);
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
}
