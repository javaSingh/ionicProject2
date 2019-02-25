import { Injectable } from '@angular/core';
import { Router,Route,UrlSegment, CanActivate, ActivatedRouteSnapshot,RouterStateSnapshot, CanLoad  } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeroGuardServiceService implements CanActivate, CanLoad{


  canLoad(route: Route, segments: UrlSegment[]){
    console.log('Inside canLoad() service.')
    console.log('Route: ')
    console.log(route)
    console.log('Segment ' +segments)
    return false
  }

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {

    console.log('Inside canActivate() service.')
    console.log('This is route: ')
    console.log(route);
    console.log('This is route url: ')
    console.log(route.url);
    console.log('This is state: ')
    console.log(state)
    console.log('This is state url: ')
    console.log(state.url)

/*     let authInfo = {
        authenticated: false
    };

    if (!authInfo.authenticated) {
        this.router.navigate(['login']);
        return false;
    } */

    return false;

}

  constructor() { }
}
