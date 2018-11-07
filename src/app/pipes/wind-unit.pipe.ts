import { Pipe, PipeTransform } from '@angular/core';
import { WindUnit } from '../models/units';

@Pipe({ name: 'windUnit' })
export class WindUnitPipe implements PipeTransform {
  transform(value: number, unit: WindUnit): string {
    const windUnit = ['km/h', 'mph', 'm/s', ''];
    if (unit === WindUnit.knot) {
      return `${value} knot${value > 1 ? 's' : ''}`;
    } else {
      return `${value} ${windUnit[unit]}`;
    }
  }
}
