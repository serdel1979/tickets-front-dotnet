import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  @ViewChild("myModalInfo", {static: false}) myModalInfo!: TemplateRef<any>;
  @ViewChild("myModalConf", {static: false}) myModalConf!: TemplateRef<any>;


  solicitudesForm: FormGroup =  this.fb.group({
    usuarioId: ['', [Validators.required]],
    usuario: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    equipo: ['', [Validators.required]],
    descripcion: ['',[Validators.required]],
    imagen: [''],
    fecha:[new Date(),[Validators.required]]
  }); 

  private isLogued: boolean = false;
  private id!: string;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: NgbModal, 
    private solicitudesServices:SolicitudesService){}

  public misSolicitudes : any[]=[];

  ngOnInit() {
    this.isLogued = this.authService.isLogued();
    if (this.isLogued){
      this.id = this.authService.getIdLogued();
      this.solicitudesServices.getMisSolicitudes(this.id).subscribe(resp=>{
        this.misSolicitudes = resp;
      })
      this.setValoresPorDefecto();
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




  mostrarModalInfo(){
    this.modalService.open(this.myModalInfo).result.then(r=>{
      if(r){
        console.log('se presiono enviar ',this.solicitudesForm.value);
      }else{
        console.log('se cerró el modal');
      }
    },err=>{
      console.error('modal cerrado ',err);
    })
  }
 
  mostrarModalConf(){
    this.modalService.open(this.myModalConf).result.then( r => {
      console.log("Tu respuesta ha sido: " + r);
    }, error => {
      console.log(error);
    });
  }
 
  enviar(){
    console.log("enviando", this.solicitudesForm.value);
  }

}
