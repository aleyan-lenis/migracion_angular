import { Component, OnInit } from '@angular/core';
import { AlertMessagesService, TypeMessage } from '../../services/alert-messages.service';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';

@Component({
	selector: 'app-alert-message',
	templateUrl: './alert-message.component.html',
	styleUrls: ['./alert-message.component.scss'],
	animations: [
		trigger('openClose', [
			state('down', style({
				marginTop:'0px'
			})),
			state('up', style({
				marginTop: '-60px'
			})),
			transition('down => up', [
				animate('0.5s')
			]),
			transition('up => down', [
				animate('0.5s')
			])
		])
	]
})
export class AlertMessageComponent implements OnInit {

	isActiveMessage: boolean = false;
	alerta: TypeMessage;

	constructor(private alertMessageService: AlertMessagesService) { }

	ngOnInit() {
		this.alertMessageService.showMessage.subscribe(
			(alerta: TypeMessage) => {
				this.isActiveMessage = true;
				this.alerta = alerta;

				if(this.alerta.tipo == "success"){
					let segundos = 2;
					const countDown = setInterval(() => {
						segundos = segundos - 1;
	
						if(segundos < 0) {
							this.isActiveMessage = false;
							clearInterval(countDown);
						}
					}, 1000);
				}
			}
		);
	}

	toggle(){
		this.isActiveMessage = !this.isActiveMessage;
	}
}

// #1db954