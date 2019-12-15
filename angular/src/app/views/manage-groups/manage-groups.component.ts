import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { Subscription } from 'rxjs';

import { faConciergeBell, faUmbrellaBeach, faWarehouse,
  faMailBulk, faUtensils, faToilet, faTv, faBed,
  faSignature, faRecycle, IconDefinition } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.css']
})
export class ManageGroupsComponent
{
  faBed:IconDefinition;
  faSignature:IconDefinition;
  faTv:IconDefinition;
  faToilet:IconDefinition;
  faUtensils:IconDefinition;
  faMailBulk:IconDefinition;
  faWarehouse:IconDefinition;
  faUmbrellaBeach:IconDefinition;
  faConciergeBell:IconDefinition;
  faRecycle:IconDefinition;

  SubsNewGroup:Subscription;
  SubsModifyGroup:Subscription;
  SubsDeleteGroup:Subscription;


  data:object;

  constructor(private _data:DataService, private _functions:FunctionsService) {
    this.data = this._data['data'];
    this.data['placeholder'] = 'Enter group name';
    this.faBed = faBed;
    this.faSignature = faSignature;
    this.faTv = faTv;
    this.faToilet = faToilet;
    this.faUtensils = faUtensils;
    this.faMailBulk = faMailBulk;
    this.faWarehouse = faWarehouse;
    this.faUmbrellaBeach = faUmbrellaBeach;
    this.faConciergeBell = faConciergeBell;
    this.faRecycle = faRecycle;

    if(this.data['index'] !== null) {
      this.data["name"] = this.data['data'][this.data['index']].name;
      this.data["icon"] = this.data['data'][this.data['index']].icon;
      this.data["groupInput"] = true;
    } else {
      this.data["name"] = '';
      this.data["icon"] = '';
    }

    this.SubsNewGroup = this._data.SubjNewGroup.subscribe((data:object)=>{
      if(data['response']) {
        this._data['data']['data'].push({
          name: this.data['formParsed'].groupname,
          icon: this.data['formParsed'].icon
        })
        this._data.SubjView.next('devices');
      } else {
        this.data['err'] = data['message'];
        this.data['view'] = 'errorFeedBack';
      }      
    })
    this.SubsModifyGroup = this._data.SubjModifyGroup.subscribe((data:any)=>{
      if(data['response']) {
        this._data['data']['data'][this.data['index']] = {
          name: this.data['formParsed'].groupname,
          icon: this.data['formParsed'].icon
        }
        this._data.SubjView.next('devices');
      } else {
        this.data['err'] = data['message'];
        this.data['view'] = 'errorFeedBack';
      } 
    })
    this.SubsDeleteGroup = this._data.SubjDeleteGroup.subscribe((data:any)=>{
      if(data['response']) {
        this._data['data']['data'] = this._data['data']['data'].filter((d:object, i:number)=>{
          return i !== this.data['index'];
        })
        this._data.SubjView.next('devices');
      } else {
        this.data['err'] = data['message'];
        this.data['view'] = 'errorFeedBack';
      } 
    })
  }

  submitForm(form:object):void {
    if(!form['form']['value']['name'] && !form['form']['value']['icon']) {
      this.data['placeholder'] = 'The name and icon are required';
      this.cleanInputError();
    } else if(!form['form']['value']['name']) {
      this.cleanInputError();
      this.data['placeholder'] = 'The name is mandatory';
    } else if(!form['form']['value']['icon']) {
      this.cleanInputError();
      this.data['placeholder'] = 'The icon is mandatory';
    } else {
      if(this.data['view'] === 'newGroup') {
        this.data['formParsed'] = {
          groupname: form['form']['value']['name'],
          icon: form['form']['value']['icon']
        }
        this._functions.ajaxHttp(`${this._data.endpoint}group`, 'post', this.data['formParsed']);
      } else if(this.data['view'] === 'modifyGroup') {
        this.data['formParsed'] = {
          groupname: form['form']['value']['name'],
          icon: form['form']['value']['icon']
        }
        this._functions.ajaxHttp(`${this._data.endpoint}group`, 'put', this.data['formParsed']);
      }
    }
  }

  cleanInput():void {
    if(!(<HTMLInputElement>document.querySelector('.form-input')).value) {
      this.data['placeholder'] = 'Group Name';
      (<HTMLInputElement>document.querySelector('.form-input')).className = 'form-input';
    }
  }

  cleanInputError():void {
    (<HTMLInputElement>document.querySelector('.form-input')).value = '';
    (<HTMLInputElement>document.querySelector('.form-input')).className += ' input-placeholder';
  }

  changeGroupView(view:string) {
    this.data['view'] = view;
  }

  deleteGroup() {
    this._functions.ajaxHttp(`${this._data['endpoint']}group/${this.data['data'][this.data['index']].name}`, 'delete', null);
  }

  ngOnDestroy() {
    this.SubsNewGroup.unsubscribe();
    this.SubsModifyGroup.unsubscribe();
  }
}
