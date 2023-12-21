import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sliceText'
})
export class SliceTextPipe implements PipeTransform {

	transform(value: string, top: number): any {
		let text;
		if (value.length <= top) text = value;
		else text = value.substr(0, top) + "...";
		return text;

	}

}
