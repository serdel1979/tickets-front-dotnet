import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/login', title: 'Login', icon: 'nc-key-25', class: '' },
  { path: '/equipos', title: 'Equipos', icon: 'nc-bank', class: '' },
  { path: '/solicitudes', title: 'Solicitudes', icon: 'nc-diamond', class: '' },
  { path: '/usuarios', title: 'Usuarios', icon: 'nc-pin-3', class: '' },
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] | undefined;
  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
}
