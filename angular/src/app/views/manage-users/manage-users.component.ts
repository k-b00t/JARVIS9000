import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { faRecycle, faHatCowboySide, faUser, faKey, faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent
{
  faPlus:IconDefinition;
  faUser:IconDefinition;
  faKey:IconDefinition;
  faHatCowboySide:IconDefinition;
  faRecycle:IconDefinition;
  subsListUser:Subscription;
  subsNewUser:Subscription;
  subsModifyUser:Subscription;
  subsDeleteUser:Subscription;
  data:object;
  dataUsers:object[];

  constructor(private _data:DataService, private _functions:FunctionsService) {
    this.faUser = faUser;
    this.faPlus = faPlus;
    this.faKey = faKey;
    this.faHatCowboySide = faHatCowboySide;
    this.faRecycle = faRecycle;
    this.data = {
      view: 'listUsers',
      user: '',
      passwd: '',
      passwdConf: '',
      role: 'user',
      placeholder: {
        user: 'Username',
        password: 'Password',
        passwordConf: 'Confirm password'
      }
    }
    this.dataUsers = [];
    this._functions.ajaxHttp(`${this._data.endpoint}user`, 'get', null);
    this.subsListUser = this._data.SubjUser.subscribe((data:any)=>{
      this.dataUsers = data;
    })
    this.subsNewUser = this._data.SubjNewUser.subscribe((data:object)=>{
      if(data['response']) {
        this.dataUsers.push({
          username: this.data['user'],
          role: this.data['role'],
          timestamp: Date.now()
        })
        this.data['view'] = 'listUsers';
      } else {
        this.data['view'] = 'errorFeedBack';
        this.data['err'] = data['message'];
      }
    })
    this.subsModifyUser = this._data.SubjModifyUser.subscribe((data:object)=>{
      if(data['response']) {
        const index = this.data['index'];
        this.dataUsers[index]['username'] = this.data['user'];
        this.dataUsers[index]['role'] = this.data['role'],
        this.data['view'] = 'listUsers';
      } else {
        this.data['view'] = 'errorFeedBack';
        this.data['err'] = data['message'];
      }
    })
    this.subsDeleteUser = this._data.SubjDeleteUser.subscribe((data:any)=>{
      if(data['response']) {
        this.dataUsers = this.dataUsers.filter((d, i)=>{
          return i !== this.data['index'];
        })
        this.data['view'] = 'listUsers';
      } else {
        this.data['view'] = 'errorFeedBack';
        this.data['err'] = data['message'];
      }
    })
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
    if(!form['form'].value.passwdConf) {
      this.data['placeholder'].passwordConf = 'Field required';
      document.querySelector('#passwdConf').className += ' input-placeholder';
    }
    if(form['form'].value.passwd &&
      form['form'].value.passwdConf &&
      (form['form'].value.passwd !== form['form'].value.passwdConf)) {
      this.cleanInputsDiferentPasswd();
      this.data['placeholder'].password = 'Passwords must be the same';
      document.querySelector('#passwd').className += ' input-placeholder';
    }

    if(form['form'].value.user &&
      form['form'].value.passwd &&
      form['form'].value.passwdConf &&
      form['form'].value.passwd === form['form'].value.passwdConf) {
      const formParsed:object = {
        username: form['form'].value.user,
        password: form['form'].value.passwd,
        role: form['form'].value.role
      }
      if(this.data['view'] === 'newUser') {
        this._functions.ajaxHttp(`${this._data.endpoint}user`, 'post', formParsed);
      } else if(this.data['view'] === 'modifyUser') {
        this._functions.ajaxHttp(`${this._data.endpoint}user`, 'put', formParsed);
      }
    }
  }

  modifyUser(index:number):void{
    const data = this.dataUsers[index];

    this.data = {
      view: 'modifyUser',
      title: 'Modify User',
      userInput: true,
      index: index,
      user: data['username'],
      passwd: '',
      passwdConf: '',
      role: data['role'],
      placeholder: {
        user: 'Username',
        password: 'Password',
        passwordConf: 'Confirm password'
      }
    }
  }

  deleteUser():void {
    this._functions.ajaxHttp(`${this._data.endpoint}user/${this.data['user']}`, 'delete', null);
  }

  cleanInputs():void {
    const nodeUsername = document.querySelector('#user');
    const nodePassword = document.querySelector('#passwd');   
    const nodePasswordConf = document.querySelector('#passwdConf');

    if(!nodeUsername['value'] && !nodePassword['value'] && !nodePasswordConf['value']) {
      nodeUsername.className = 'form-input';
      nodePassword.className = 'form-input';
      nodePasswordConf.className = 'form-input';
      this.data['placeholder'] = {
        user: 'Username',
        password: 'Password',
        passwordConf: 'Confirm password'
      }
    }
  }

  cleanInputsDiferentPasswd():void {
    const nodeUsername = document.querySelector('#user');
    const nodePassword = document.querySelector('#passwd');   
    const nodePasswordConf = document.querySelector('#passwdConf');
    nodeUsername.className = 'form-input';
    nodePassword.className = 'form-input';
    nodePasswordConf.className = 'form-input';
    this.data = {
      view: this.data['view'],
      index: this.data['index'],
      title: this.data['title'],
      user: this.data['user'],
      passwd: '',
      role: this.data['role'],
      placeholder: {
        user: 'Username',
        password: 'Password',
        passwordConf: 'Confirm password'
      }
    }
  }

  changeUserView(view:string):void {
    switch(view) {
      case('newUser'):
        this.data = {
          view: 'newUser',
          title: 'New User',
          userInput: false,
          user: '',
          passwd: '',
          passwdConf: '',
          role: 'user',
          placeholder: {
            user: 'Username',
            password: 'Password',
            passwordConf: 'Confirm password'
          }
        }
        break;
      case('listUsers'):
        this.data['view'] = 'listUsers';
        break;
      case('modifyUser'):
        this.data['view'] = 'modifyUser';
        break;
      case('confirmDelete'):
        this.data['view'] = 'confirmDelete';
        break;
    }
  }
  
  momentGetNow(date:Date) {
    return moment(date).fromNow();
  }



  ngOnDestroy() {
    this.subsListUser.unsubscribe();
    this.subsNewUser.unsubscribe();
    this.subsModifyUser.unsubscribe();
    this.subsDeleteUser.unsubscribe();
  }
}
