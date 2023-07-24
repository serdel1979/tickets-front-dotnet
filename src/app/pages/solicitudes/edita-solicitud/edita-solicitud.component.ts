import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ValidaFormsService } from 'src/app/validators/valida-forms.service';
import { environment } from 'src/environments/environment';


const URLHub = environment.urlHub;


interface NewMessage {
  userName: string;
  message: string;
  groupName?: string;
}

@Component({
  selector: 'app-edita-solicitud',
  templateUrl: './edita-solicitud.component.html',
  styleUrls: ['./edita-solicitud.component.css']
})
export class EditaSolicitudComponent implements OnInit {

  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
    userName: 'Sistema'
  }];
  private connection: HubConnection;

  public idSolicitud!: number;

  public solicitud!: Solicitud;


  public errorNotFound: boolean = false;

  public buscando: boolean = false;

  public estadosPosibles!: any[];


  estadoForm: FormGroup = this.fb.group({
    estadoActual: ['', [Validators.required]],
    comentario: ['', [Validators.required, this.validaText.textInvalid]],
    solicitudId: ['', [Validators.required]],
    fecha: [new Date(), [Validators.required]]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private validaText: ValidaFormsService,
    private solicitudesService: SolicitudesService) {
    this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

    this.connection.on("NewUser", message => this.newUser(message));
    this.connection.on("NewMessage", () => console.log('editado'));
    this.connection.on("LeftUser", message => this.leftUser(message));
  }

  ngOnInit(): void {
    this.idSolicitud = this.route.snapshot.params['id'];
    this.setValoresPorDefecto();
    this.solicitudesService.getSolicitud(this.idSolicitud).subscribe(async resp => {
      this.solicitud = resp;
      this.connection.start().then(async () => {
        // La conexión se ha establecido correctamente
        console.log("conexión socket ok...");
        //------------------
        this.connection.invoke('JoinGroup', 'refresh', 'soporte')
          .then(_ => {
            this.joined = true;
          });
        //------------------
        await this.notificarCambio();
      }).catch(err => {
        console.error(err.toString());
      });
      this.solicitudesService.getEstadosPosibles(this.idSolicitud).subscribe(estados => {
        this.estadosPosibles = estados;
      })
    })
  }


  volver() {
    window.history.back();
  }

  agregarEstado() {
    this.solicitudesService.agregaEstado(this.estadoForm.value, this.idSolicitud).subscribe(async resp => {
      await this.notificarCambio();
      this.volver();
    },
      err => {})
  }

  setValoresPorDefecto() {
    const fechaActual = new Date();
    const solicitudId = this.idSolicitud;

    this.estadoForm.patchValue({
      fecha: fechaActual,
      solicitudId: solicitudId,
    });
  }


  campoNoValido(campo: string) {
    return this.estadoForm.get(campo)?.invalid && this.estadoForm.get(campo)?.touched
  }

  get comentErrorMsg(): string {
    const errors = this.estadoForm.get('comentario')?.errors;
    if (errors?.['required']) {
      return "La descripción es obligatoria";
    } else if (errors?.['notOnlyWhitespace']) {
      return "No puede escribir solo espacios en blanco"
    }
    return ("Longitud máxima debe ser de 256 caracteres");
  }


  public leave() {
    this.connection.invoke('LeaveGroup', this.groupName, this.userName)
      .then(_ => this.joined = false);
  }

  async notificarCambio() {
    const newMessage: NewMessage = {
      message: 'refrescar',
      userName: 'user',
      groupName: 'refresh'
    };
    this.connection.invoke('SendMessage', newMessage)
      .then(_ => this.messageToSend = '');
  }

  private newUser(message: string) {
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }

  private newMessage(message: NewMessage) {
    this.conversation.push(message);
  }

  private leftUser(message: string) {
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


}
