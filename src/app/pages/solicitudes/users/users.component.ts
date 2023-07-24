import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { ValidaFormsService } from 'src/app/validators/valida-forms.service';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatredisService } from '../../../services/chatredis.service';


const URLHub = environment.urlHub;

interface NewMessage {
  userName: string;
  message: string;
  groupName?: string;
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  @ViewChild("myModalInfo", { static: false }) myModalInfo!: TemplateRef<any>;
  @ViewChild("myModalConf", { static: false }) myModalConf!: TemplateRef<any>;



  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: NewMessage[] = [{
    message: 'Bienvenido',
    userName: 'Sistema'
  }];

  public mostrarSpinner: boolean = false;


  archivoSeleccionado: File | null = null;

  imagenURL: string = '';

  sound: any; 

  mostrarChat: boolean = false;

  message: string = '';
  messages: string[] = [];

  paginationId: string = 'my-pagination';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  public page!: number;
  private connection: HubConnection;
  // Variables de paginación
  pageSize: number = 5; // Tamaño de página (número de solicitudes por página)
  totalPages: number = 0; // Total de páginas
  paginatedSolicitudes: any[] = []; // Solicitudes que se mostrarán en la página actual


  solicitudesForm: FormGroup = this.fb.group({
    usuarioId: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    equipo: ['', [Validators.required]],
    descripcion: ['', [Validators.required,this.validaText.textInvalid]],
    imagen: [''],
    fecha: [new Date(), [Validators.required]]
  });


  public imagenBase64!: string | ArrayBuffer | null;

  private isLogued: boolean = false;
  private id!: string;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: NgbModal,
    public validaText: ValidaFormsService,
    private solicitudesServices: SolicitudesService) {
      this.sound = new Audio('../../../../assets/sound/solicitud.mp3');
      this.connection = new HubConnectionBuilder()
      .withUrl(URLHub) // URL del concentrador en tu servidor
      .build();

      this.connection.on("NewUser", message => this.newUser(message));
      this.connection.on("NewMessage",()=>this.refresh(true));
      this.connection.on("LeftUser", message => this.leftUser(message));
    }

  public misSolicitudes: Solicitud[] = [];

  async ngOnInit() {
    this.connection.start()
    .then(()=> {
      //------------------
      this.connection.invoke('JoinGroup', 'refresh', 'user')
      .then(_ => {
        this.joined = true;
      });
      //------------------
    }).catch((error:any) => {
      return console.error(error);
    });
    await this.refresh(false);
  }

  async refresh(flag:boolean){
   // if(flag)this.sound.play();
    this.isLogued = this.authService.isLogued();
    if (this.isLogued) {
      this.id = this.authService.getIdLogued();
      this.mostrarSpinner = true;
      this.solicitudesServices.getMisSolicitudes().subscribe(resp => {
        this.mostrarSpinner = false;
        this.misSolicitudes = resp;
      },
      ()=>{
        this.mostrarSpinner = false;
      })
      this.setValoresPorDefecto();
    };
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
    this.conversation.push(message);
  }

  private leftUser(message: string) {
    this.conversation.push({
      userName: 'Sistema',
      message: message
    });
  }
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.archivoSeleccionado = file;
    if (file instanceof Blob) {
      this.getImagenURL(file)
        .then(url => {
          this.imagenURL = url;
        })
    }
  }

  setValoresPorDefecto() {
    const fechaActual = new Date();
    const usuarioIdPorDefecto = this.authService.getIdLogued();
    const usuarioPorDefecto = this.authService.getUserLogued();

    this.solicitudesForm.patchValue({
      fecha: fechaActual,
      usuarioId: usuarioIdPorDefecto,
      departamento: usuarioPorDefecto
    });
  }




  mostrarModalInfo() {
    this.modalService.open(this.myModalInfo).result.then(async r => {
      if (r) {
        await this.onSubmit();
      } else {
        this.resetForm();
      }
    }, err => {
      this.resetForm();
    })
  }

  mostrarModalConf() {
    this.modalService.open(this.myModalConf).result.then(r => {
    }, () => {
    });
  }





  getImagenURL(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        resolve(event.target.result); // Resuelve la promesa con la URL de datos (data URL) de la imagen
      };

      reader.onerror = (event) => {
        reject(event); // Rechaza la promesa en caso de error
      };

      reader.readAsDataURL(file);
    });
  }


  async onSubmit() {
    this.mostrarSpinner = true;
    const formData = new FormData();
    if (this.archivoSeleccionado) {

      formData.append('imagen', this.archivoSeleccionado);

    }
    // Agrega los valores del formulario reactivo al formData
    Object.keys(this.solicitudesForm.value).forEach(key => {
      if (key === 'fecha') {
        formData.append(key, new Date(this.solicitudesForm.value[key]).toISOString());
      } else {
        formData.append(key, this.solicitudesForm.value[key]);
      }
    });
    this.solicitudesServices.enviaSolicitud(formData).subscribe({
      next: () => {
        this.resetForm();
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Solicitud enviada!!!</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-success alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
        this.solicitudesServices.getMisSolicitudes().subscribe(resp => {
          this.misSolicitudes = resp;
        });

        const newMessage: NewMessage = {
          message: 'refrescar',
          userName: 'soporte',
          groupName: 'refresh'
        };
        this.connection.invoke('SendMessage', newMessage)
        .then(_ => this.messageToSend = '');

        this.mostrarSpinner = false;
      },
      error: (error) => {
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' + error + '</span>',
          "",
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            toastClass: "alert alert-danger alert-with-icon",
            positionClass: "toast-" + "top" + "-" + "center"
          }
        );
        this.mostrarSpinner = false;
      }

    })
  }

  resetForm() {
    this.solicitudesForm.reset();
    this.setValoresPorDefecto();
    this.archivoSeleccionado = null;
    this.imagenURL = '';
  }

  ver(id:number) {
    this.router.navigate([`/solicitudes/detalle/${id}`]);
  }

  chat() {
    this.mostrarChat = !this.mostrarChat;
  }
  toggleChat() {
    this.mostrarChat = !this.mostrarChat;
  }




  async notificarCambio(){
    const newMessage: NewMessage = {
      message: 'refrescar',
      userName: 'soporte',
      groupName: 'refresh'
    };
    this.connection.invoke('SendMessage', newMessage)
    .then(_ => this.messageToSend = '');
  }

  onPageChange(event: any) {
    this.page = event;
  }


  campoNoValido(campo:string){
    return this.solicitudesForm.get(campo)?.invalid && this.solicitudesForm.get(campo)?.touched
  }

  get comentErrorMsg():string {
    const errors = this.solicitudesForm.get('descripcion')?.errors;
    if(errors?.['required']){
      return "La descripción es obligatoria";
    }else if(errors?.['notOnlyWhitespace']){
      return "No puede escribir solo espacios en blanco"
    }
    return("Longitud máxima debe ser de 256 caracteres");
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
