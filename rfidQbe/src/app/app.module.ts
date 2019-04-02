import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http'

import { HttpProvider } from './providers/http/http'
// import { Xml2Ts} from './providers/xml2js/xml2ts'

// npm install ion2-calendar@next moment --save
import { CalendarModule } from 'ion2-calendar';
 import { IonicSelectableModule } from 'ionic-selectable';

 import {ModalPage} from './modal/modal.page'

 import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [AppComponent,ModalPage],
  entryComponents: [ModalPage],
  imports: [BrowserModule,IonicSelectableModule,IonicModule.forRoot(), AppRoutingModule,HttpClientModule,CalendarModule,FormsModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  providers: [
HttpProvider,
// Xml2Ts,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
