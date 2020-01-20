import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginComponent } from './views/login/login.component';
import { HomeComponent } from './views/home/home.component';

import { DataService } from './services/data.service';
import { FunctionsService } from './services/functions.service';
import { DevicesComponent } from './views/devices/devices.component';
import { ManageUsersComponent } from './views/manage-users/manage-users.component';
import { ManageGroupsComponent } from './views/manage-groups/manage-groups.component';
import { ManageDevicesComponent } from './views/manage-devices/manage-devices.component';
import { SocketIoService } from './services/socket-io.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DevicesComponent,
    ManageUsersComponent,
    ManageGroupsComponent,
    ManageDevicesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    DataService,
    FunctionsService,
    SocketIoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
