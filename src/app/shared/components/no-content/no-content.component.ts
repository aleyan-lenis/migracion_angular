import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-no-content',
	templateUrl: './no-content.component.html',
	styleUrls: ['./no-content.component.scss']
})
export class NoContentComponent implements OnInit {

	@Input('lista') lista:any[] = [];
	@Input('contenido') contenido:string;

	constructor() { }

	ngOnInit() {
	}

}
