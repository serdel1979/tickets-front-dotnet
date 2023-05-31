import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  @ViewChild("myModalInfo", { static: false }) myModalInfo!: TemplateRef<any>;
  @ViewChild("myModalConf", { static: false }) myModalConf!: TemplateRef<any>;

  @ViewChild('messageInput') messageInput!: ElementRef;

  public mostrarSpinner: boolean = false;

  archivoSeleccionado: File | null = null;

  imagenURL: string = '';

  mostrarChat: boolean = false;

  message: string = '';
  messages: string[] = [];

  paginationId: string = 'my-pagination';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  public page!: number;
  // Variables de paginación
  pageSize: number = 3; // Tamaño de página (número de solicitudes por página)
  totalPages: number = 0; // Total de páginas
  paginatedSolicitudes: any[] = []; // Solicitudes que se mostrarán en la página actual


  solicitudesForm: FormGroup = this.fb.group({
    usuarioId: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    equipo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
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
    private solicitudesServices: SolicitudesService) {}

  public misSolicitudes: Solicitud[] = [];

  ngOnInit() {
    this.isLogued = this.authService.isLogued();
    if (this.isLogued) {
      this.id = this.authService.getIdLogued();
      this.solicitudesServices.getMisSolicitudes(this.id).subscribe(resp => {
        this.misSolicitudes = resp;
      })
      this.setValoresPorDefecto();
    }
  }


  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.archivoSeleccionado = file;
    if (file instanceof Blob) {
      this.getImagenURL(file)
        .then(url => {
          this.imagenURL = url;
        })
        .catch(error => {
          console.log('Error al obtener la URL de la imagen:', error);
        });
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
      console.log("Tu respuesta ha sido: " + r);
    }, error => {
      console.log(error);
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
    // Aquí puedes hacer la solicitud HTTP utilizando Angular HttpClient
    // Ejemplo:
    // this.http.post('URL_DEL_ENDPOINT', formData).subscribe(response => {
    //   // Manejar la respuesta del servidor
    // });
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
        this.solicitudesServices.getMisSolicitudes(this.id).subscribe(resp => {
          this.misSolicitudes = resp;
        });
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
    console.log("chat");
    this.mostrarChat = !this.mostrarChat;
  }
  toggleChat() {
    this.mostrarChat = !this.mostrarChat;
  }


  sendMessage() {
    if (this.message) {
      if (this.messages.length >= 8) {
        this.messages.shift(); // Elimina el primer elemento
      }
      this.messages.push(this.message);
      this.message = '';
      this.messageInput.nativeElement.focus();
    }
  }

  onPageChange(event: any) {
    this.page = event;
  }

}
