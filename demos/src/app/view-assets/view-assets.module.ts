import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewAssetsPage } from './view-assets.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ReactiveFormsModule } from '@angular/forms';

import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

// import { NetworkInterface } from '@ionic-native/network-interface';

const routes: Routes = [
  {
    path: '',
    component: ViewAssetsPage
  }
];

@NgModule({
  imports: [
    // NetworkInterface,
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/logs', 
      level: NgxLoggerLevel.DEBUG, 
      // serverLogLevel: NgxLoggerLevel.ERROR
    }),
    ReactiveFormsModule,
    NgxDatatableModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewAssetsPage]
})
export class ViewAssetsPageModule {}
