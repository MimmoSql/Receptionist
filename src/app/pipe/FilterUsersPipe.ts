import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      (item.nome && item.nome.toLowerCase().includes(searchTerm)) ||
      (item.cognome && item.cognome.toLowerCase().includes(searchTerm)) ||
      (item.sinonimi && item.sinonimi.toLowerCase().includes(searchTerm)) ||
      (item.interno && item.interno.toString().includes(searchTerm))
    );
  }
}
