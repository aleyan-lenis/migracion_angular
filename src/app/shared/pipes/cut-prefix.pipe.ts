import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'cutPrefix'
})
export class CutPrefixPipe implements PipeTransform {

	transform(value: string, args?: any): any {
		if(value != null || value != undefined){
			value = value.substring(value.indexOf(' '));
		}
		return value;
	}

}
