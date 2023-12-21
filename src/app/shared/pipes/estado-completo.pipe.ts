import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'estadoCompleto'
})
export class EstadoCompletoPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		switch(value){
			case "A": return "Activo";
			case "I": return "Inactivo";
			case "P": return "Pendiente de aprobacion";
			case "C": return "Cancelada";
			case "L": return 'Liquidado'
		}
	}
}
