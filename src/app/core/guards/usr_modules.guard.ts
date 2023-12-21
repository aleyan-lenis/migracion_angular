import { CanActivate, Router, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Route } from '@angular/compiler/src/core';

@Injectable()
export class UsrModulesGuard implements CanActivate {

	constructor(private authService: AuthService,
					private router: Router,
					private route: ActivatedRoute){}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		if(this.authService.checkHavePermission(state.url)){
			return true;
		}
		else{
			this.router.navigate(['not-have-permission']);
		}
	}
}