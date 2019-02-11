import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormsPage } from './forms.page';

import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: FormsPage
  }
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormsPage]
})
export class FormsPageModule {}
