import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { Subscription } from 'rxjs';


import { faHeadphonesAlt, faCoffee, faHdd,
  faLightbulb, faTv, faPlug, faWindowMaximize, faFan,
  faTerminal, faSignature, faSatelliteDish, IconDefinition } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-manage-devices',
  templateUrl: './manage-devices.component.html',
  styleUrls: ['./manage-devices.component.css']
})
export class ManageDevicesComponent
{
  faSignature:IconDefinition;
  faSatelliteDish:IconDefinition;
  faTerminal:IconDefinition;
  faLightbulb:IconDefinition;
  faTv:IconDefinition;
  faPlug:IconDefinition;
  faWindowMaximize:IconDefinition;
  faFan:IconDefinition;
  faHeadphonesAlt:IconDefinition;
  faCoffee:IconDefinition;
  faHdd:IconDefinition;

  subsNewDevice:Subscription;
  subsModifyDevice:Subscription;
  subsDeleteDevice:Subscription;

  data: object;

  constructor(private _data:DataService, private _functions:FunctionsService) {
    this.faSignature = faSignature;
    this.faSatelliteDish = faSatelliteDish;
    this.faTerminal = faTerminal;
    this.faLightbulb = faLightbulb;
    this.faTv = faTv;
    this.faPlug = faPlug;
    this.faWindowMaximize = faWindowMaximize;
    this.faFan = faFan;
    this.faHeadphonesAlt = faHeadphonesAlt;
    this.faCoffee = faCoffee;
    this.faHdd = faHdd;

    this.data = this._data['data'];
    this.data['group'] = this.data['data'][this.data['selectedGroup']]['name'];
    this.data['placeholder'] = {
      name: 'Device name',
      ip: 'Device IP',
      command: 'Command',
    }
    this.data['selectedDevice'] = '',
    this.data["name"] = '',
    this.data["ip"] = '',
    this.data["icon"] = '',
    this.data["command"] = '',
    this.subsNewDevice = this._data.SubjNewDevice.subscribe((data:any)=>{
      this._data['data']['data'][this._data['data']['selectedGroup']]['devices'].push(data['data']);
      this._functions.manageView('devices');
    })
    this.subsModifyDevice = this._data.SubjModifyDevice.subscribe((data:any)=>{
      this._data['data']['data'][this._data['data']['selectedGroup']]['devices'] = this._data['data']['data'][this._data['data']['selectedGroup']]['devices'].map((d:object)=>{
        if(d['_id'] == this.data['_id']) {
          return data['data']['data'];
        }
        return d;
      })
      this._functions.manageView('devices');
    })
    this.subsDeleteDevice = this._data.SubjDeleteDevice.subscribe((data:any)=>{
      this._data['data']['data'][this._data['data']['selectedGroup']]['devices'] = this._data['data']['data'][this._data['data']['selectedGroup']]['devices'].filter((d:object)=>{
        return d['_id'] != this.data['_id'];
      })
      this._functions.manageView('devices');
    })
  }


  submitForm(form:object) {
    if(!form['form']['value']['name'] && !form['form']['value']['ip'] && !form['form']['value']['command']) {
      this.data['placeholder'] = {
        name: 'The name is mandatory',
        ip: 'The ip is mandatory',
        command: 'The command is mandatory'
      }
      this.cleanInputError('all');
    } else if(!form['form']['value']['name'] || !form['form']['value']['ip'] || !form['form']['value']['command']){
      if(!form['form']['value']['name']) {
        this.cleanInputError('name');
        this.data['placeholder']['name'] = 'The name is mandatory';
      }
      if(!form['form']['value']['ip']) {
        this.cleanInputError('ip');
        this.data['placeholder']['ip'] = 'The ip is mandatory';
      }
      if(!form['form']['value']['command']) {
        this.cleanInputError('command');
        this.data['placeholder']['command'] = 'The command is mandatory';
      } 
    } else {
      if(this.data['view'] === 'newDevice') {
        this.data['formParsed'] = {
          groupname: this.data['group'],
          name: form['form']['value']['name'],
          icon: form['form']['value']['icon'],
          ip: form['form']['value']['ip'],
          command: form['form']['value']['command'],
          selector: `ip${form['form']['value']['ip'].replace(/\./g, '')}com${form['form']['value']['command']}`
        }
        this._functions.ajaxHttp(`${this._data.endpoint}devices`, 'post', this.data['formParsed']);
      } else if(this.data['view'] === 'modifyDevice') {
        this.data['formParsed'] = {
          groupname: this.data['group'],
          id: this.data['_id'],
          name: form['form']['value']['name'],
          icon: form['form']['value']['icon'],
          ip: form['form']['value']['ip'],
          command: form['form']['value']['command'],
          selector: `ip${form['form']['value']['ip'].replace(/\./g, '')}com${form['form']['value']['command']}`
        }
        this._functions.ajaxHttp(`${this._data.endpoint}devices`, 'put', this.data['formParsed']);
      }
    }



  }
  cleanInput():void {
    if(!(<HTMLInputElement>document.querySelector('#name')).value) {
      this.data['placeholder']['name'] = 'Device name';
      (<HTMLInputElement>document.querySelector('#name')).className = 'form-input';
    }
    if(!(<HTMLInputElement>document.querySelector('#ip')).value) {
      this.data['placeholder']['ip'] = 'Device IP';
      (<HTMLInputElement>document.querySelector('#ip')).className = 'form-input';
    }
    if(!(<HTMLInputElement>document.querySelector('#command')).value) {
      this.data['placeholder']['command'] = 'Command';
      (<HTMLInputElement>document.querySelector('#command')).className = 'form-input';
    }
  }

  cleanInputError(opt:string):any {
    switch(opt){
      case('all'):
        (<HTMLInputElement>document.querySelector('#name')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#ip')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#command')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#name')).value = '';
        (<HTMLInputElement>document.querySelector('#ip')).value = '';
        (<HTMLInputElement>document.querySelector('#command')).value = '';
      break;

      case('name'):
        (<HTMLInputElement>document.querySelector('#name')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#name')).value = '';
      break;

      case('ip'):
        (<HTMLInputElement>document.querySelector('#ip')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#ip')).value = '';

      break;
      case('command'):
        (<HTMLInputElement>document.querySelector('#command')).className += ' input-placeholder';
        (<HTMLInputElement>document.querySelector('#command')).value = '';

      break;
    }
  }

  selectDevice(device:object):void {
    this.data['selectedDevice'] = device['name'];
    this.data['_id'] = device['_id'];
    this.data["name"] = device['name'];
    this.data["ip"] = device['ip'];
    this.data["icon"] = device['icon'];
    this.data["command"] = device["command"];
    this.data['view'] = 'modifyDevice';
  }

  changeView(view:string) {
    this.data["view"] = view;
  }

  deleteDevice() {
    this._functions.ajaxHttp(`${this._data.endpoint}devices/${this.data['group']}/${this.data['_id']}`, 'delete', null);
  }


  ngOnDestroy() {
    this.subsNewDevice.unsubscribe();
    this.subsModifyDevice.unsubscribe();
    this.subsDeleteDevice.unsubscribe();
  }
}