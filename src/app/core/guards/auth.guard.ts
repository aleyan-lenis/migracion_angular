import { CanActivate, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import Cookie from 'js-cookie'

import { AuthService } from '../authentication/auth.service';
import * as CONST from '../properties/parametros.parameter';


@Injectable()
export class AuthGuard implements CanActivate, CanLoad{

   constructor(private authService: AuthService,
               private router: Router){}

   canActivate(): Observable<boolean> | Promise<boolean> | boolean {
      if(this.isSesionIniciada() || this.authService.isAuthenticated()){
			return true;
		}
		else{
			this.router.navigate(['login']);
		}
	}
	
	canLoad(route: Route):boolean{
		let url:string = route.path;
		if(this.isSesionIniciada() || this.authService.isAuthenticated()){
			return true;
		}
		else{
			this.router.navigate(['login']);
		}
	}

   private isSesionIniciada(){
		return localStorage.getItem(CONST.USER_TOKEN_COOKIE) != null;
   }
}