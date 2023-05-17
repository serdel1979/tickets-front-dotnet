import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/login', title: 'Login', icon: 'nc-key-25', class: '' },
  { path: '/equipos', title: 'Equipos', icon: 'nc-laptop', class: '' },
  { path: '/solicitudes', title: 'Solicitudes', icon: 'nc-bullet-list-67', class: '' },
  { path: '/historial', title: 'Historial', icon: 'nc-paper', class: '' },
  { path: '/usuarios', title: 'Usuarios', icon: 'nc-single-02', class: '' },
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
