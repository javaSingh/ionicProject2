import { Component, OnInit, Injectable} from '@angular/core';
import { Router,CanActivate,ActivatedRouteSnapshot  } from '@angular/router'

@Component({
  selector: 'app-hero-guards',
  templateUrl: './hero-guards.page.html',
  styleUrls: ['./hero-guards.page.scss'],
})

@Injectable()
export class HeroGuardsPage implements OnInit, CanActivate {
  userLoginId
  password


  constructor(public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('Inside canActivate(). Coming from: '+route )
    return true

  }

  login(){
    console.log('Login Clicked')
  }

  ngOnInit() {
  }

}
