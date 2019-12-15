import { Component } from '@angular/core';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  modalOptions:NgbModalOptions;

  SubsSocketGetDataEvent:Subscription;
  SubsSocketChangeStateEvent:Subscription;

  data:object;

  constructor(private _data:DataService, private _functions:FunctionsService, private modalService: NgbModal, private _socket:SocketIoService) {
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
      data: this._data['data']['data']
    }
    if(!this.data['selectedGroup'] && this.data['data'] !== []) {
      this.data['selectedGroup'] = this._data['data']['selectedGroup'] || '0';
    }
    this.modalOptions = {
        backdrop:'static',
        backdropClass:'customBackdrop',
        centered: true
    }
    this.SubsSocketGetDataEvent = this._data.SubjSocketGetDataEvent.subscribe((data:object)=>{
      console.log('getData')
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
    this.data["data"][this.data["selectedGroup"]]["devices"].forEach((d:object)=> {
      if(!this.data['state'][d['ip']]) {
        this.data['state'][d['ip']] = [d['command']];
      } else {
        this.data['state'][d['ip']].push(d['command']);
      }
    })
  }

  setDeviceState(data:object):any {
    data['data'].forEach(d=>{
      document.querySelector(`ip${d.ip}`)
    })
  }

  openModal(content) {
    this.modalService.open(content, this.modalOptions)
      .result.then((result) => {}, (reason) => {}
    )
  }

  changeGroup(index:number) {
    this.data['selectedGroup'] = index.toString();
  }

  newGroup(view:string):void {
    this.modalService.dismissAll();
    this._data['data']['index'] = null;
    this._data['data']['view'] = 'newGroup';
    this._data['data']['title'] = 'New Group';
    this._data['data']['selectedGroup'] = this.data['selectedGroup'];
    this._functions.manageView(view);
  }

  modifyGroup(view:string):void {
    this.modalService.dismissAll();
    this._data['data']['index'] = parseInt(this.data['selectedGroup']);
    this._data['data']['view'] = 'modifyGroup';
    this._data['data']['title'] = 'Modify Group';
    this._data['data']['selectedGroup'] = this.data['selectedGroup'];
    this._functions.manageView(view);
  }

  newDevice(view:string):void {
    this._data['data']['view'] = 'newDevice';
    this._data['data']['title'] = 'New Device';
    this._data['data']['selectedGroup'] = this.data['selectedGroup'];
    this._functions.manageView(view);
  }

  sendCommand(device:object):void {
    const data = {
      ip: device['ip'],
      command: device['command'],
      selector: device['selector']
    }
    this._socket.changeStateEmit(data);
  }


  ngOnDestroy() {
    this.SubsSocketGetDataEvent.unsubscribe();
    this.SubsSocketChangeStateEvent.unsubscribe();
  }
}
