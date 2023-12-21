import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-alarmaServicioHogar',
	templateUrl: './alarmaServicioHogar.component.html',
	styleUrls: ['./alarmaServicioHogar.component.scss']
})
export class AlarmaServicioHogarComponent implements OnInit {

	constructor(
    private dialog: MatDialog){}

	ngOnInit(){
		// if(this.authService.isSessionFinished()) this.authService.sesionCaducada();
	}

}
