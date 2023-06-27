import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  admin: boolean;
}

export const ROUTES: RouteInfo[] = [
  { path: '/solicitudes', title: 'Solicitudes', icon: 'nc-bullet-list-67', class: '', admin: false},
  { path: '/historial', title: 'Historial', icon: 'nc-paper', class: '', admin: false },
  { path: '/usuarios', title: 'Usuarios', icon: 'nc-single-02', class: '', admin: true},
  { path: '/equipos', title: 'Equipos', icon: 'nc-laptop', class: '', admin: false},
  { path: '/chat', title: 'Chat', icon: 'nc-chat-33', class: '', admin: false }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  public usrName: string = '';

  isLoggedIn: boolean = false;

  isAdmin: boolean = false;
  

  private subscription!: Subscription;


  constructor(private authService: AuthService){
    console.log("constructor sidebar");
  }



  public menuItems: any[] | undefined;

  public filteredMenuItems: RouteInfo[] = [];

  ngOnInit() {
    this.isLoggedIn = this.authService.isLogued();
    this.usrName = this.authService.getUserLogued();
    this.isAdmin = this.authService.isAdmin();
    this.subscription = this.authService.isLoggedInChange.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if(loggedIn){
        this.usrName = this.authService.getUserLogued();
        this.isAdmin = this.authService.isAdmin();
      }
      
    });
    
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    console.log(this.menuItems);
  }


  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
