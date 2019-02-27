import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {ModalPagePage} from './modal-page/modal-page.page'

import { HttpClientModule } from '@angular/common/http'
import { HeroGuardServiceService } from './hero-guard-service.service';

import { IonicStorageModule } from '@ionic/storage';
// npm install @ionic/storage --save



@NgModule({
  declarations: [AppComponent,ModalPagePage],
  entryComponents: [ModalPagePage],
  imports: [ IonicStorageModule.forRoot(), HttpClientModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    HeroGuardServiceService,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})



export class AppModule {}


