import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  @ViewChild("myModalInfo", {static: false}) myModalInfo!: TemplateRef<any>;
  @ViewChild("myModalConf", {static: false}) myModalConf!: TemplateRef<any>;

  private isLogued: boolean = false;
  private id!: string;
  constructor(
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
    }
  }

  mostrarModalInfo(){
    this.modalService.open(this.myModalInfo);
  }
 
  mostrarModalConf(){
    this.modalService.open(this.myModalConf).result.then( r => {
      console.log("Tu respuesta ha sido: " + r);
    }, error => {
      console.log(error);
    });
  }
 

}
