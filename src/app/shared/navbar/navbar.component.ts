import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from 'src/app/sidebar/sidebar.component';
import { Location } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
  private listTitles: any[] = [];
  location: Location;
  private nativeElement: Node;
  private toggleButton!: Element;
  private sidebarVisible: boolean;

  public logued: boolean = false;

  public isCollapsed = true;
  @ViewChild("navbar-cmp", { static: false }) button: any;

  constructor(private authService: AuthService, location: Location, private renderer: Renderer2, private element: ElementRef, private router: Router) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.logued = this.authService.isLogued();
    this.authService.isLoggedInChange.subscribe((isLogued)=>{
      this.logued = isLogued;
    })
    this.listTitles = ROUTES.filter((listTitle: any) => listTitle);
    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    titlee = titlee.slice(1);
    const stringOriginal = titlee;
    const stringsSeparados = stringOriginal.split("/");
    var titulo = '';
    if (stringsSeparados.length > 0) {
      if (stringsSeparados[1]) {
        titulo = `${stringsSeparados[0]} ${stringsSeparados[1]}`;
      } else {
        titulo = `${stringsSeparados[0]}`;
      }
      return titulo;
    }
    return titlee;
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);

    html.classList.add('nav-open');
    if (window.innerWidth < 991) {
      mainPanel.style.position = 'fixed';
    }
    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    if (window.innerWidth < 991) {
      setTimeout(function () {
        mainPanel.style.position = '';
      }, 500);
    }
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }

  }

  salir() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
