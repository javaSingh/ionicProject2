import { Component, OnInit, Injectable} from '@angular/core';
import { Router,CanActivate,ActivatedRouteSnapshot  } from '@angular/router'

@Component({
  selector: 'app-hero-guards',
  templateUrl: './hero-guards.page.html',
  styleUrls: ['./hero-guards.page.scss'],
})

@Injectable()
export class HeroGuardsPage implements OnInit, CanActivate {

  constructor(public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('Inside canActivate(). Coming from: '+route )
    return true

  }

  ngOnInit() {
  }

}
