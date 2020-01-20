import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class DataService
{
  socket:string;
  endpoint:string;
  data:object;
  SubjLogin:Subject<object>;
  SubjView:Subject<string>;
  SubjUser:Subject<object[]>;
  SubjData:Subject<object>;
  SubjNewGroup:Subject<object>;
  SubjNewDevice:Subject<object>;
  SubjNewUser:Subject<object>;
  SubjModifyUser:Subject<object>;
  SubjModifyGroup:Subject<object>;
  SubjModifyDevice:Subject<object>;
  SubjDeleteUser:Subject<object>;
  SubjDeleteGroup:Subject<object>;
  SubjDeleteDevice:Subject<object>;;
  SubjSocketGetDataEvent:Subject<object>;
  SubjSocketChangeStateEvent:Subject<object>;
  SubjSocketStats:Subject<object>;

  constructor() {
    this.socket = 'https://k-b00t.developer.li:3000/';
    this.endpoint = 'https://k-b00t.developer.li:3000/';

    this.data = {
      view: '',
      title: '',
      data: []
    }

    this.SubjLogin = new Subject<object>();
    this.SubjView = new Subject<string>();
    this.SubjUser = new Subject<object[]>();
    this.SubjData = new Subject<object>();
    this.SubjNewUser = new Subject<object>();
    this.SubjNewGroup = new Subject<object>();
    this.SubjNewDevice = new Subject<object>();
    this.SubjModifyUser = new Subject<object>();
    this.SubjModifyGroup = new Subject<object>();
    this.SubjModifyDevice = new Subject<object>();
    this.SubjDeleteUser = new Subject<object>();
    this.SubjDeleteGroup = new Subject<object>();
    this.SubjDeleteDevice = new Subject<object>();
    this.SubjSocketGetDataEvent = new Subject<object>();
    this.SubjSocketChangeStateEvent = new Subject<object>();
    this.SubjSocketStats = new Subject<object>();
  }
}
