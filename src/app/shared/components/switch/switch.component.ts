import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-switch',
	templateUrl: './switch.component.html',
	styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit {

	@Input('firstOption') firstOption: string;
	@Input('secondOption') secondOption: string;

	actualOption: string;

	@Output('optionChanged') optionChanged:EventEmitter<string> = new EventEmitter<string>();

	constructor() { }

	ngOnInit() {
		this.actualOption = this.firstOption;
	}

	cambiarOpcion(){
		this.actualOption = this.actualOption == this.firstOption ? this.secondOption : this.firstOption;
		this.optionChanged.emit(this.actualOption);
	}
}
