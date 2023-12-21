import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

	@Input() tamaño: 'md' | 'lg';
	isMedium: boolean;

	constructor() { }

	ngOnInit() {
		if (this.tamaño == null) this.tamaño = 'md';
		this.isMedium = this.tamaño == 'md';
	}

}
