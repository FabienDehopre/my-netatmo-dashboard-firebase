import { Pipe, PipeTransform } from '@angular/core';
import { PressureUnit } from '../models/units';

@Pipe({ name: 'pressureUnit' })
export class PressureUnitPipe implements PipeTransform {
  transform(value: number, unit: PressureUnit): string {
    const pressureUnit = ['mbar', 'inHg', 'mmHg'];
    return `${value} ${pressureUnit[unit]}`;
  }
}
