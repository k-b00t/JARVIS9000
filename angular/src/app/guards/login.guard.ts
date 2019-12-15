import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard
{
  constructor(private _router:Router) {}

  canActivate():any {
    if(document.cookie) {
      const cookieType:string = document.cookie.slice(0 ,4);
      if(cookieType === 'welc') {
        return true;
      }
    }
    this._router.navigateByUrl('/welcome');
  } 
  
}
