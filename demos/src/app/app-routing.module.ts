import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroGuardServiceService } from './hero-guard-service.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'qbedemo', loadChildren: './qbedemo/qbedemo.module#QBEDemoPageModule' },
  { path: 'modal-page', loadChildren: './modal-page/modal-page.module#ModalPagePageModule' },
  { path: 'http-samples', loadChildren: './http-samples/http-samples.module#HttpSamplesPageModule'
  //in case of canActivate() is false, a blank page will open.
  // ,canActivate:[false]
},
  { path: 'forms', loadChildren: './forms/forms.module#FormsPageModule' },
  { path: 'view-assets', loadChildren: './view-assets/view-assets.module#ViewAssetsPageModule' },
  { path: 'hero-token-sample-login-page', loadChildren: './hero-token-sample-login-page/hero-token-sample-login-page.module#HeroTokenSampleLoginPagePageModule' },
  { path: 'hero-guards', loadChildren: './hero-guards/hero-guards.module#HeroGuardsPageModule' 
  // , canLoad: [HeroGuardServiceService]
  , canActivate: [HeroGuardServiceService]
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
