import { Pipe, PipeTransform } from '@angular/core';

import { Unit } from '../models/units';

const ALTITUDE = ['m', 'ft'];

@Pipe({ name: 'altitude' })
export class AltitudePipe implements PipeTransform {
  transform(value: number, unit?: Unit): string {
    return `${value}${ALTITUDE[unit]}`;
  }
}
