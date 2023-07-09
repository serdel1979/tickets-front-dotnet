import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ChatredisService } from '../services/chatredis.service';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  admin: boolean;
}

export const ROUTES: RouteInfo[] = [
  { path: '/solicitudes', title: 'Solicitudes', icon: 'nc-bullet-list-67', class: '', admin: false },
  { path: '/historial', title: 'Historial', icon: 'nc-paper', class: '', admin: false },
  { path: '/usuarios', title: 'Usuarios', icon: 'nc-single-02', class: '', admin: true },
  { path: '/equipos', title: 'Equipos', icon: 'nc-laptop', class: '', admin: false }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [`
          .indicator-icon {
          display: flex;
          align-items: center;
        }

        .indicator {
          margin-left: 5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: green;
        }
  `]
})
export class SidebarComponent implements OnInit {

  public usrName: string = '';

  isLoggedIn: boolean = false;

  isAdmin: boolean = false;


  private subscription!: Subscription;


  constructor(private authService: AuthService, private chatService: ChatredisService) { }


  anyGroupHasNewMessages: boolean = false;

  newMessageIndicators: { [key: string]: boolean } = {};

  public menuItems: any[] | undefined;

  public filteredMenuItems: RouteInfo[] = [];

  ngOnInit() {

    this.isLoggedIn = this.authService.isLogued();
    this.usrName = this.authService.getUserLogued();
    this.isAdmin = this.authService.isAdmin();
    this.subscription = this.authService.isLoggedInChange.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.usrName = this.authService.getUserLogued();
        this.isAdmin = this.authService.isAdmin();
        if(this.isAdmin){
          this.chatService.initAnyGroupHasNewMessages()
          .then((inicial) => {
            this.anyGroupHasNewMessages = inicial;
          })
        }else{
            const usr = this.authService.getUserLogued();
            const activeMessagesIndicator = this.chatService.getActiveMessagesIndicator(usr);
            activeMessagesIndicator.subscribe((isActive: boolean) => {
                this.newMessageIndicators[usr] = isActive;
            });
        }
        
      }

    });
    this.chatService.getAnyGroupHasNewMessages().subscribe(hasNewMessages => {
      this.anyGroupHasNewMessages = hasNewMessages;
    });

    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }


  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
