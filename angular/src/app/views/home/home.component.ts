import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { faHome, faUserCog, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
{
  faUserCog:IconDefinition;
  faHome:IconDefinition;

  subsData:Subscription;
  subsView:Subscription;
  subsStatus:Subscription;
  
  data:any;


  constructor(private _data:DataService, private _functions:FunctionsService) {
    this.faUserCog = faUserCog;
    this.faHome = faHome;
    this._data['data']['role'] = document.cookie.split('role=')[1];
    this.data = {
      view: '',
      stats: {},
      role: this._data['data']['role']
    }
    this.subsView = this._data.SubjView.subscribe((data:string)=>{
      this.data['view'] = data;
    })
    this.subsData  = this._data.SubjData.subscribe((data:any)=>{
      this._data['data']['data'] = data;
      this.data['view'] = 'devices';
    })
    this.subsStatus = this._data.SubjSocketStats.subscribe((data:any)=>{
      this.data['stats'] = data;
    })
    this._functions.ajaxHttp(`${this._data.endpoint}groups`, 'get', null);

  }



  manageView(view:string):void {
    this._functions.manageView(view);
  }

  ngOnDestroy() {
    this.subsView.unsubscribe();
    this.subsData.unsubscribe();
    this.subsStatus.unsubscribe();
  }
}
