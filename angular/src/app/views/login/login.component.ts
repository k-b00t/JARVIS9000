import { Component } from '@angular/core';
import { faSignInAlt, faUser, faKey, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FunctionsService } from 'src/app/services/functions.service';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent
{
  faSignInAlt:IconDefinition;
  faUser:IconDefinition;
  faKey:IconDefinition;

  data:object;
  subsLogin:Subscription;

  constructor(private _data:DataService, private _function:FunctionsService)
  {
    this.subsLogin = this._data.SubjLogin.subscribe((data:object)=>{
      if(data['error'] === 'user') {
        document.querySelector('#user').className += ' input-placeholder';
        this.data = {
          view: 'form',
          placeholder: {
            user: data['message']
          }
        }
      } else if(data['error'] === 'password'){
        document.querySelector('#passwd').className += ' input-placeholder';
        this.data = {
          view: 'form',
          placeholder: {
            password: data['message']
          }
        }
      } else if(data['error'] === 'maxTry'){
        this.data['nextLogin'] = ((data['message'] - Date.now()) / 1000).toFixed(0);
        this.data['view'] = 'maxAttempts';
        this.countDown();
      } 
    })

    this.faSignInAlt = faSignInAlt;
    this.faUser = faUser;
    this.faKey = faKey;
    this.data = {
      view: 'form',
      placeholder: {
        user: 'Username',
        password: 'Password'
      }
    }
  }

  cleanInputs():void {
    const nodeUsername = document.querySelector('#user');
    const nodePassword = document.querySelector('#passwd');

    if(!nodeUsername['value'] && !nodePassword['value']) {
      nodeUsername.className = 'form-input';
      nodePassword.className = 'form-input';
      this.data = {
        view: 'form',
        user: '',
        passwd: '',
        placeholder: {
          user: 'Username',
          password: 'Password'
        }
      }
    }
  }

  sendForm(form:object):void {
    if(!form['form'].value.user) {
      this.data['placeholder'].user = 'Field required';
      document.querySelector('#user').className += ' input-placeholder';
    }
    if(!form['form'].value.passwd) {
      this.data['placeholder'].password = 'Field required';
      document.querySelector('#passwd').className += ' input-placeholder';
    }
    if(form['form'].value.user && form['form'].value.passwd) {
      const formParsed:object = {
        username: form['form'].value.user,
        password: form['form'].value.passwd
      }
      this._function.ajaxHttp(`${this._data.endpoint}login`, 'post', formParsed)
    }
  }

  countDown():void {
    setTimeout(()=>{
      if(this.data['nextLogin'] > 0) {
        this.data['nextLogin'] = this.data['nextLogin'] -1;
        this.countDown();
      } else {
        this.data['view'] = 'form'; 
      }
    }, 1000)
  }


  ngOnDestroy() {
    this.subsLogin.unsubscribe();
  }
}