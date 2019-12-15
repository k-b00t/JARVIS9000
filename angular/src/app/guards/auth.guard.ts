import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard
{
  url:string;

  constructor(private _router:Router) { }

  canActivate():any {
    if(document.cookie) {
      const cookieType:string = document.cookie.slice(0 ,4);
      if(cookieType === 'auth') {
        return true;
      } else {
        this.url = '/login';
      }
    } else {
      this.url = '/login';
    }
    this._router.navigateByUrl(this.url);
  }
}
