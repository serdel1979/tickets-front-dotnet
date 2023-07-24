import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutePreviewService {



  private previousRoute!: string;

  constructor() { }
  setPreviousRoute(route: string) {
    this.previousRoute = route;
  }

  getPreviousRoute(): string {
    return this.previousRoute;
  }


}
