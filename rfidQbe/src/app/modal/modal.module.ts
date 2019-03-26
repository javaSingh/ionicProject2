import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';

// import { ModalPage } from './modal.page';

const routes: Routes = [
  {
    path: '',
    // component: ModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicSelectableModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [ModalPage]
})
export class ModalPageModule {}
