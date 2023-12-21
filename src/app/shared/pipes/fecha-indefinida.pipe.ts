import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'fechaIndefinida'
})
export class FechaIndefinidaPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		const fecha = new Date(0, 0, 0);
		if (new Date(value).getFullYear() == fecha.getFullYear() || value == null)
			return "Indefinido";
		else
			return value;
	}

}
