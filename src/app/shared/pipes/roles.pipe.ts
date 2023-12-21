import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  transform(rol: string, args?: any): any {
    switch(rol){
      case 'ALM_SOL':
      case 'SOL': 
        return 'Solicitante';
      case 'ALM_SIS':
      case 'SIS': 
        return 'Sistemas';
      case 'ALM_SAC': 
      case 'SAC': 
        return 'Customer';
      case 'ALM_ADM':
      case 'ADM': 
        return 'Administrador';
    }
  }

}
