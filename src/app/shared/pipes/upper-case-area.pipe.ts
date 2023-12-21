import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'upperCaseArea'
})
export class UpperCaseAreaPipe implements PipeTransform {

	transform(value: string, args?: any): any {
		const area = value.substring(0, 3).toUpperCase();
		return area + " " + value.slice(4);
	}

}
