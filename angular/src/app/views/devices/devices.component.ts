import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from 'src/app/services/data.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { SocketIoService } from 'src/app/services/socket-io.service';


import { faHeadphonesAlt, faCoffee, faHdd, faFan,
  faLightbulb, faPlug, faPlus, faWindowMaximize, 
  faConciergeBell, faUmbrellaBeach, faWarehouse,
  faMailBulk, faUtensils, faToilet, faTv, faBed,
  faSignature, faCog, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';





@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent
{
  faPlus:IconDefinition;
  faBed:IconDefinition;
  faSignature:IconDefinition;
  faTv:IconDefinition;
  faToilet:IconDefinition;
  faUtensils:IconDefinition;
  faMailBulk:IconDefinition;
  faWarehouse:IconDefinition;
  faUmbrellaBeach:IconDefinition;
  faConciergeBell:IconDefinition;
  faCog:IconDefinition;
  faTimes:IconDefinition

  faLightbulb:IconDefinition;
  faPlug:IconDefinition;
  faWindowMaximize:IconDefinition;
  faFan:IconDefinition;
  faHeadphonesAlt:IconDefinition;
  faCoffee:IconDefinition;
  faHdd:IconDefinition;

  SubsSocketGetDataEvent:Subscription;
  SubsSocketChangeStateEvent:Subscription;

  data:any;

  constructor(private _data:DataService, private _functions:FunctionsService, private _socket:SocketIoService) {
    this.faPlus = faPlus;
    this.faBed = faBed;
    this.faSignature = faSignature;
    this.faTv = faTv;
    this.faToilet = faToilet;
    this.faUtensils = faUtensils;
    this.faMailBulk = faMailBulk;
    this.faWarehouse = faWarehouse;
    this.faUmbrellaBeach = faUmbrellaBeach;
    this.faConciergeBell = faConciergeBell;
    this.faTimes = faTimes;
    this.faCog = faCog;
    this.faLightbulb = faLightbulb;
    this.faPlug = faPlug;
    this.faWindowMaximize = faWindowMaximize;
    this.faFan = faFan;
    this.faHeadphonesAlt = faHeadphonesAlt;
    this.faCoffee = faCoffee;
    this.faHdd = faHdd;

    this.data = {
      checked: true,
      state: {},
      data: this._data['data']['data'],
      role: this._data['data']['role']
    }

    if(!this.data['selectedGroup'] && this.data['data'] !== []) {
      (this.data['data'][this._data['data']['selectedGroup']])
        ? this.data['selectedGroup'] = this._data['data']['selectedGroup']
        : this.data['selectedGroup'] = '0';
    }
    this.SubsSocketGetDataEvent = this._data.SubjSocketGetDataEvent.subscribe((data:object)=>{
      data['command'].forEach((d:any)=>{
        const node = document.querySelector(`#ip${data['ip'].replace(/\./g, '')}com${d['value']}`);
        (d['state'] == 1)
          ? node.className = 'mx-2 my-auto icon-green'
          : node.className = 'mx-2 my-auto icon-red';
      })
    })
    this.SubsSocketChangeStateEvent = this._data.SubjSocketChangeStateEvent.subscribe((data:object)=>{
      let node = document.querySelector(`#${data['selector']}`);
      if(node) {
        (data['command']['state'] == 1)
          ? node.className = 'mx-2 my-auto icon-green'
          : node.className = 'mx-2 my-auto icon-red';
      }
    })
    this.getDeviceState();
    this._socket.getDataEmit(this.data['state']);
  }


  getDeviceState():void {
    if(this.data['data'].length !== 0) {
      this.data['state'] = {};
      this.data["data"][this.data["selectedGroup"]]["devices"].forEach((d:object)=> {
        if(!this.data['state'][d['ip']]) {
          this.data['state'][d['ip']] =  {
            command: [d['command']],
            protocol: d['protocol']
          }
        } else {
          this.data['state'][d['ip']]['command'].push(d['command']);
        }
      })
    }
  }


  setDeviceState(data:object):any {
    data['data'].forEach(d=>{
      document.querySelector(`ip${d.ip}`)
    })
  }

  changeGroup(index:number) {
    this.data['selectedGroup'] = index.toString();
    this.getDeviceState();
    this._socket.getDataEmit(this.data['state']);
  }

  manageGroup(view:string):void {
    this._data['data']['index'] = null;
    this._data['data']['view'] = 'newGroup';
    this._data['data']['title'] = 'New Group';
    this._data['data']['selectedGroup'] = null;
    this._functions.manageView(view);
  }

  newDevice(view:string):void {
    this._data['data']['view'] = 'newDevice';
    this._data['data']['title'] = 'New Device';
    this._data['data']['selectedGroup'] = this.data['selectedGroup'];
    this._functions.manageView(view);
  }

  sendCommand(device:object):void {
    
    /* device:
          _id: "5e19b0abb0e43c30c18807da"
          name: "LUZ"
          icon: "faLightbulb"
          ip: "10.10.0.10"
          command: "LUZ00"
          protocol: "udp"
          selector: "ip1010010comLUZ00"
    */

    const data = {
      ip: device['ip'],
      command: device['command'],
      protocol: device['protocol'],
      selector: device['selector']
    }
    this._socket.changeStateEmit(data);
  }


  ngOnDestroy() {
    this.SubsSocketGetDataEvent.unsubscribe();
    this.SubsSocketChangeStateEvent.unsubscribe();
  }
}
