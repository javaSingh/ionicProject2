import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HeroGuardsPage } from './hero-guards.page';

const routes: Routes = [
  {
    path: '',
    component: HeroGuardsPage,
    // canActivate:[HeroGuardsPage]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HeroGuardsPage]
})
export class HeroGuardsPageModule {}
