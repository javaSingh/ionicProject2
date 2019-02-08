import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HttpSamplesPage } from './http-samples.page';

const routes: Routes = [
  {
    path: '',
    component: HttpSamplesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HttpSamplesPage]
})
export class HttpSamplesPageModule {}
