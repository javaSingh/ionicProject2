import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
