import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'capitalLetter'
})
export class CapitalLetterPipe implements PipeTransform {

	transform(value: string, args?: any): any {
		const firstLetter = value.substr(0,1).toUpperCase();
		const text = value.substr(1).toLowerCase();
		return firstLetter + text;
		
	}

}
