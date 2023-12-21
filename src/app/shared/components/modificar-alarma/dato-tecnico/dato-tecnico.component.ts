import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { DatosTecnicos } from 'src/app/core/models/alarmas.model';
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { UtilService } from 'src/app/shared/services/utils.service';

import * as PARAM from '../../../../core/properties/parametros.parameter';
import { Response } from 'src/app/core/models/response.model';

@Component({
	selector: 'app-dato-tecnico',
	templateUrl: './dato-tecnico.component.html',
	styleUrls: ['./dato-tecnico.component.scss']
})
export class DatoTecnicoComponent implements OnInit {

	@Input('formDatoTecnico') form: FormGroup;
	@Input() datosTecnicos: DatosTecnicos;
	@Input() estadoAlarma: string;
	@Input() desabilitado: boolean = true;
	@Input() isDisabled= true;
	hservicio: string;
	tiposServicios: string[];
	puertoServicio: string[];
	dbServicio: string[];
	distribuidor: string[];
	integrador: string[];
	instancia: string[];
	isSRE: boolean = false;
	parametro: string;
	@Input() estadoGeneral: string;
	@Input() mostrarInformacionDT= false;

	constructor(private alarmaService: AlarmaService,
		private builder: FormBuilder,
		private utilService: UtilService) { }

	ngOnInit() {
		this.form.get('tipoServicio').setValue('');
		this.form.get('puertoServicio').setValue('');
		this.form.get('dbServicio').setValue('');
		this.form.get('instancia').setValue('');
		this.form.get('distribuidor').setValue('');
		this.form.get('integrador').setValue('');
		this.form.get('endpoint').setValue('');
		this.form.get('campoIdentificacion').setValue('');
		this.form.get('campoSubscripcion').setValue('');
		this.form.get('campoResult').setValue('');
		this.form.get('campoInfAdicional').setValue('');
		this.form.get('idServicio').setValue('');

		this.utilService.obtenerParametro(PARAM.TIPOS_SERVICIOS_FW).subscribe(
			(response: Response) => {
				if (response.error == null) {
					this.tiposServicios = (<string>response.objeto).split(',');
				}
			}
		);

		this.alarmaService.setDatosTecnicos.subscribe(
			(datosTecnicos: DatosTecnicos) => {
				this.form.patchValue(datosTecnicos);
				if (this.form.value.idServicio != null) {
					this.onChangeServicio({
						target: {
							value: this.form.value.tipoServicio
						}
					});
				}

			}
		)
	}

	onChangeServicio(e) {
		const servicio = e.target.value;
		this.parametro = "";
		this.isSRE = false;

		this.form.get('puertoServicio').reset();
		this.form.get('dbServicio').setValue(0);
		this.form.get('instancia').reset();
		this.form.get('distribuidor').reset();
		this.form.get('integrador').reset();

		if (servicio != "0") {
			switch (servicio) {
				case 'SRE':
					this.parametro = PARAM.PUERTOS_SRE;
					this.isSRE = true;
					break;
				case 'JEIS':
					this.parametro = PARAM.PUERTOS_JEIS; break;
				case 'OTROS':
					this.parametro = 'OTROS'; break;
			};

			if (this.parametro != "OTROS") {
				this.utilService.obtenerParametro(this.parametro).subscribe(
					(response: Response) => {
						if (response.error == null) {
							this.puertoServicio = (<string>response.objeto).split(',');
							this.form.get('puertoServicio').enable();
						}
					}
				);

				this.utilService.obtenerParametro(PARAM.DATABASES).subscribe(
					(response: Response) => {
						if (response.error == null) {
							this.dbServicio = (<string>response.objeto).split(',');
							this.form.get('dbServicio').enable();
						}
					}
				);

				if (this.isSRE) {
					this.utilService.obtenerParametro(PARAM.SRE_DISTRIBUIDORES).subscribe(
						(response: Response) => {
							if (response.error == null) {
								this.distribuidor = (<string>response.objeto).split(',');
								this.form.get('distribuidor').enable();
							}
						}
					);

					this.utilService.obtenerParametro(PARAM.SRE_INTEGRADORES).subscribe(
						(response: Response) => {
							if (response.error == null) {
								this.integrador = (<string>response.objeto).split(',');
								this.form.get('integrador').enable();
							}
						}
					);

					this.utilService.obtenerParametro(PARAM.SRE_INSTANCIAS).subscribe(
						(response: Response) => {
							if (response.error == null) {
								this.instancia = (<string>response.objeto).split(',');
								this.form.get('instancia').enable();
							}
						}
					);
				}
				else {
					this.form.get('instancia').disable();
					this.form.get('distribuidor').disable();
					this.form.get('integrador').disable();
				}
			}
			else{
				this.form.get('dbServicio').reset();
				this.form.get('puertoServicio').reset();
				this.form.get('instancia').reset();
				this.form.get('distribuidor').reset();
				this.form.get('integrador').reset();
			}
		}
		else {
			this.form.get('puertoServicio').disable();
			this.form.get('dbServicio').disable();
		}
	}

}
