import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/solicitudes', title: 'Solicitudes', icon: 'nc-bullet-list-67', class: '' },
  { path: '/historial', title: 'Historial', icon: 'nc-paper', class: '' },
  { path: '/usuarios', title: 'Usuarios', icon: 'nc-single-02', class: '' },
  { path: '/equipos', title: 'Equipos', icon: 'nc-laptop', class: '' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  public userlogued: string = '';

  isLoggedIn: boolean = false;
  

  private subscription!: Subscription;


  constructor(private authService: AuthService){}



  public menuItems: any[] | undefined;
  ngOnInit() {
    this.isLoggedIn = this.authService.isLogued();
    this.subscription = this.authService.isLoggedInChange.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
