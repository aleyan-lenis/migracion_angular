import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';

@Component({
	selector: 'app-solicitudes',
	templateUrl: './solicitudes.component.html',
	styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {

	isUserAdm: boolean;
	isUserSol: boolean;

	constructor(private authService: AuthService) { }

	ngOnInit() {
		// if(this.authService.isSessionFinished()) this.authService.sesionCaducada();
		this.isUserAdm = this.authService.isUserAdm();
		this.isUserSol = this.authService.isUserSol();
	}

}
