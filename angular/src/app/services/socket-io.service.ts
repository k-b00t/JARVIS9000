import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketIoService
{
  socket:any;

  constructor(private _data:DataService) {
    this.socket = io.connect(this._data['socket']);
    this.socket.on('getData', (data:any)=>{
      this._data.SubjSocketGetDataEvent.next(data);
    })
    this.socket.on('changeState', (data:any)=>{
      this._data.SubjSocketChangeStateEvent.next(data);
    })
  }


  getDataEmit(data:any) {
    this.socket.emit('getData', data);
  }

  changeStateEmit(data:any) {
    this.socket.emit('changeState', data)
  }
}