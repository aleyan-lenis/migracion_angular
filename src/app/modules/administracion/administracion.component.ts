import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
	selector: 'app-administracion',
	templateUrl: './administracion.component.html',
	styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {

	constructor(private authService: AuthService){}

	ngOnInit(){
		// if(this.authService.isSessionFinished()) this.authService.sesionCaducada();
	}
	
}
