import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud } from 'src/app/interfaces/solicitud.interface';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ValidaFormsService } from 'src/app/validators/valida-forms.service';

@Component({
  selector: 'app-edita-solicitud',
  templateUrl: './edita-solicitud.component.html',
  styleUrls: ['./edita-solicitud.component.css']
})
export class EditaSolicitudComponent implements OnInit {


  public idSolicitud!: number;

  public solicitud!: Solicitud;


  public errorNotFound: boolean = false;

  public buscando: boolean = false;

  public estadosPosibles!: any[];


  estadoForm: FormGroup = this.fb.group({
    estadoActual: ['', [Validators.required]],
    comentario: ['', [Validators.required,this.validaText.textInvalid]],
    solicitudId: ['', [Validators.required]],
    fecha: [new Date(), [Validators.required]]
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router, 
    private validaText: ValidaFormsService,
    private solicitudesService: SolicitudesService){}

  ngOnInit(): void {
      this.idSolicitud = this.route.snapshot.params['id'];
      this.setValoresPorDefecto();
      this.solicitudesService.getSolicitud(this.idSolicitud).subscribe(resp=>{
        this.solicitud = resp;
        this.solicitudesService.getEstadosPosibles(this.idSolicitud).subscribe(estados=>{
          this.estadosPosibles = estados;
        })
      })
  }

  volver(){
    this.router.navigate([`/solicitudes`]);
  }

  agregarEstado(){
    console.log(this.estadoForm.value);
    this.solicitudesService.agregaEstado(this.estadoForm.value,this.idSolicitud).subscribe(resp=>{
      console.log(resp);
      this.volver();
    },
    err=>{
      console.log(err);
    })
  }

  setValoresPorDefecto() {
    const fechaActual = new Date();
    const solicitudId = this.idSolicitud;

    this.estadoForm.patchValue({
      fecha: fechaActual,
      solicitudId: solicitudId,
    });
  }


  campoNoValido(campo:string){
    return this.estadoForm.get(campo)?.invalid && this.estadoForm.get(campo)?.touched
  }

  get comentErrorMsg():string {
    const errors = this.estadoForm.get('comentario')?.errors;
    if(errors?.['required']){
      return "La descripción es obligatoria";
    }else if(errors?.['notOnlyWhitespace']){
      return "No puede escribir solo espacios en blanco"
    }
    return("Longitud máxima debe ser de 256 caracteres");
  }




}
