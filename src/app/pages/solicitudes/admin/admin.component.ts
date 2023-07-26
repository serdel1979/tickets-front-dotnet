import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { AuthService } from '../../../auth/auth.service';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../../services/chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidaFormsService } from 'src/app/validators/valida-forms.service';
import { ToastrService } from 'ngx-toastr';


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

  @ViewChild("myModalInfo", { static: false }) myModalInfo!: TemplateRef<any>;

  archivoSeleccionado: File | null = null;

  imagenURL: string = '';

  public mostrarSpinner: boolean = false;
  public spinnerMostrar:boolean = false;
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

  public solicitudes : Solicitud[] = [];

  solicitudesForm: FormGroup = this.fb.group({
    usuarioId: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    equipo: ['', [Validators.required]],
    descripcion: ['', [Validators.required,this.validaText.textInvalid]],
    imagen: [''],
    fecha: [new Date(), [Validators.required]]
  });


  constructor(private solicitudesService: SolicitudesService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    public validaText: ValidaFormsService,
    private chatService: ChatService,
    private modalService: NgbModal) {
    
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
    //if(flag)this.sound.play();
    this.isLogued = this.authService.isLogued();
    this.userName = this.authService.getUserLogued();
    this.spinnerMostrar = true;
    if (this.isLogued) {
      this.solicitudesService.getSolicitudes().subscribe(async resp => {
        this.solicitudes = resp;
        this.spinnerMostrar = false;
      },
      (err)=>{
        this.spinnerMostrar = false;
      })
      this.setValoresPorDefecto();
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

  public join() {
    this.connection.invoke('JoinGroup', this.groupName, this.userName)
      .then(_ => {
        this.joined = true;
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
    this.solicitudesService.enviaSolicitud(formData).subscribe({
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
        this.refresh(false);

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



  resetForm() {
    this.solicitudesForm.reset();
    this.setValoresPorDefecto();
    this.archivoSeleccionado = null;
    this.imagenURL = '';
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




}
