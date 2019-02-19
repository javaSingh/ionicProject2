import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HeroTokenSampleLoginPagePage } from './hero-token-sample-login-page.page';

const routes: Routes = [
  {
    path: '',
    component: HeroTokenSampleLoginPagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HeroTokenSampleLoginPagePage]
})
export class HeroTokenSampleLoginPagePageModule {}
