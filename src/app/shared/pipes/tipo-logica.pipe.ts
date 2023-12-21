import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoLogica'
})
export class TipoLogicaPipe implements PipeTransform {

  transform(tipoLogica: string, args?: any): any {
    switch(tipoLogica){
      case 'IYS': return 'Identificacion y Subscripciones';
      case 'SPI': return 'Solo por identificacion';
      case 'SPS': return 'Solo por subscripciones';
    }
  }

}
