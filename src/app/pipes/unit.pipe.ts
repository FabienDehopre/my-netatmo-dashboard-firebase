import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from '../models/units';

@Pipe({ name: 'unit' })
export class UnitPipe implements PipeTransform {
  transform(value: number, unit: Unit): string {
    const units = ['°C', '°F'];
    return `${value} ${units[unit]}`;
  }
}
