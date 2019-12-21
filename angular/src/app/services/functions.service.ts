import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from './data.service';



@Injectable({
  providedIn: 'root'
})
export class FunctionsService
{
  headers:any;
  SubsAjax:Subscription;

  constructor(private _data:DataService, private _http:HttpClient, private _router:Router) {
    this.headers = {
      headers: new HttpHeaders({
        'x-requested-with': 'XMLHttpResponse',
        'Content-Type': 'application/json'
      }),
      withCredentials: true
    }
  }

  manageView(view:string):void {
    this._data.SubjView.next(view);
  }

  ajaxHttp(url:string, method:string, data:any):void {
    switch(method) {
      case('get'):
        this.SubsAjax = this._http.get(url, this.headers).subscribe(
          (data)=> { this.getRequest(data) },
          (err)=> { throw err })
        break;

      case('post'):
        this.SubsAjax = this._http.post(url, data, this.headers).subscribe(
          (data)=> { this.postRequest(data) },
          (err)=> { throw err })
        break;

      case('put'):
        this.SubsAjax = this._http.put(url, data, this.headers).subscribe(
          (data)=> { this.putRequest(data) },
          (err)=> { throw err })
        break;

      case('delete'):
        this.SubsAjax = this._http.delete(url, this.headers).subscribe(
          (data)=> { this.deleteRequest(data) },
          (err)=> { throw err })
        break;
    }
  }


  getRequest(data:any):void {
    if(data['listUser']) {
      this._data.SubjUser.next(data['data']);
    } else if (data['listGroup']){
      this._data.SubjData.next(data['data']);
    }
  }

  postRequest(data:any):void {
    if(data['login'] !== undefined) {
      switch(data['login']) {
        case(true):
          this._router.navigateByUrl('/');
        break;
        case('username'):
          this._data.SubjLogin.next({
            error: 'user',
            message: data['message']
          })
        break;
        case('password'):
          this._data.SubjLogin.next({
            error: 'password',
            message: data['message']
          })
        break;
        case('maxTry'):
          this._data.SubjLogin.next({
            error: 'maxTry',
            message: data['message']
          })
        break;
        case('both'):
          this._data.SubjLogin.next({
            error: 'both',
            message: data['message']
          })
        break;
      }
    } else if (data['newUser'] !== undefined) {
      switch(data['newUser']){
        case(true):
          this._data.SubjNewUser.next({
            response: true
          })
        break;

        case(false):
          this._data.SubjNewUser.next({
            response: false,
            message: data['message']
          })
        break;
      }
    }  else if (data['newGroup'] !== undefined) {
      switch(data['newGroup']){
        case(true):
          this._data.SubjNewGroup.next({
            response: true
          })
        break;

        case(false):
          this._data.SubjNewGroup.next({
            response: false,
            message: data['message']
          })
        break;
      }
    }else if(data['newDevice'] !== undefined) {
      switch(data['newDevice']) {
        case(true):
          this._data.SubjNewDevice.next({
            response: true,
            data: data['data']
          })
        break;
        case(false):
          this._data.SubjNewDevice.next({
            response: false,
            message: data['message']
          })
        break;
      }
    }
  }

  putRequest(data:any):void {
    if(data['modifyUser'] !== undefined) {
      switch(data['modifyUser']) {
        case(true):
          this._data.SubjModifyUser.next({response: true});
        break;

        case(false):
          this._data.SubjModifyUser.next({
            response: false,
            message: data['message']
          })
        break;
      }
    } else if(data['modifyGroup'] !== undefined) {
      switch(data['modifyGroup']) {
        case(true):
          this._data.SubjModifyGroup.next({response: true});
          break;
        case(false):
          this._data.SubjModifyGroup.next({
            response: false,
            message: data['message']
          })
          break;
      }
    }  else if(data['modifyDevice'] !== undefined) {
      switch(data['modifyDevice']) {
        case(true):
          this._data.SubjModifyDevice.next({
            response: true,
            data: data
          })
        break;
        
        case(false):
          this._data.SubjModifyDevice.next({
            response: false,
            message: data['message']
          })
        break;
      }
    }
  }

  deleteRequest(data:any):void {
    if(data['deleteUser'] !== undefined) {
      if(data['deleteUser']) {
        this._data.SubjDeleteUser.next({ response: true })
      } else {
        this._data.SubjDeleteUser.next({
          response: false,
          message: data['message']
        })
      }
    } else if(data['deleteGroup'] !== undefined) {
      if(data['deleteGroup']) {
        this._data.SubjDeleteGroup.next({ response: true })
      } else {
        this._data.SubjDeleteGroup.next({
          response: false,
          message: data['message']
        })
      } 
    } else if(data['deleteDevice'] !== undefined) {
      if(data['deleteDevice']) {
        this._data.SubjDeleteDevice.next({ response: true })
      }
    } else {
      this._data.SubjDeleteDevice.next({
        response: false,
        message: data['message']
      })
    }
  }
}
