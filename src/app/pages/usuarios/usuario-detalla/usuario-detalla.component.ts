import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usuario-detalla',
  templateUrl: './usuario-detalla.component.html',
  styleUrls: ['./usuario-detalla.component.css']
})
export class UsuarioDetallaComponent implements OnInit{

  public idUsuario: string = '';


  constructor(private router: Router,
    private route: ActivatedRoute,){}

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.params['id'];

    console.log(this.idUsuario);
  }

}
