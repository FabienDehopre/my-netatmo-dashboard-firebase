import { Pipe, PipeTransform } from '@angular/core';
import {
  faBatteryEmpty,
  faBatteryFull,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryThreeQuarters,
  faQuestion,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

import { Battery } from '../models/battery';

@Pipe({ name: 'battery' })
export class BatteryPipe implements PipeTransform {
  transform(
    value: Battery,
    moduleType: 'NAModule1' | 'NAModule2' | 'NAModule3' | 'NAModule4',
    outputType: 'icon' | 'cssClass'
  ): IconDefinition | string {
    if (!value) {
      return this.getNone(outputType);
    }

    switch (moduleType) {
      case 'NAModule1':
        return this.getIconOrCssClassForOutdoorModule(value, outputType);
      case 'NAModule2':
        return this.getIconOrCssClassForWindGaugeModule(value, outputType);
      case 'NAModule3':
        return this.getIconOrCssClassForRainGaugeModule(value, outputType);
      case 'NAModule4':
        return this.getIconOrCssClassForIndoorModule(value, outputType);
      default:
        return this.getNone(outputType);
    }
  }

  private getIconOrCssClassForIndoorModule(value: Battery, outputType: 'icon' | 'cssClass'): IconDefinition | string {
    if (value.vp > 5640) {
      return outputType === 'icon' ? faBatteryFull : 'battery--full';
    } else if (value.vp > 5280) {
      return outputType === 'icon' ? faBatteryThreeQuarters : 'battery--three-quarters';
    } else if (value.vp > 4920) {
      return outputType === 'icon' ? faBatteryHalf : 'battery--half';
    } else if (value.vp > 4560) {
      return outputType === 'icon' ? faBatteryQuarter : 'battery--quarter';
    } else {
      return outputType === 'icon' ? faBatteryEmpty : 'battery--empty';
    }
  }

  private getIconOrCssClassForOutdoorModule(value: Battery, outputType: 'icon' | 'cssClass'): IconDefinition | string {
    if (value.vp > 5500) {
      return outputType === 'icon' ? faBatteryFull : 'battery--full';
    } else if (value.vp > 5000) {
      return outputType === 'icon' ? faBatteryThreeQuarters : 'battery--three-quarters';
    } else if (value.vp > 4500) {
      return outputType === 'icon' ? faBatteryHalf : 'battery--half';
    } else if (value.vp > 4000) {
      return outputType === 'icon' ? faBatteryQuarter : 'battery--quarter';
    } else {
      return outputType === 'icon' ? faBatteryEmpty : 'battery--empty';
    }
  }

  private getIconOrCssClassForRainGaugeModule(value: Battery, outputType: 'icon' | 'cssClass'): IconDefinition | string {
    if (value.vp > 5500) {
      return outputType === 'icon' ? faBatteryFull : 'battery--full';
    } else if (value.vp > 5000) {
      return outputType === 'icon' ? faBatteryThreeQuarters : 'battery--three-quarters';
    } else if (value.vp > 4500) {
      return outputType === 'icon' ? faBatteryHalf : 'battery--half';
    } else if (value.vp > 4000) {
      return outputType === 'icon' ? faBatteryQuarter : 'battery--quarter';
    } else {
      return outputType === 'icon' ? faBatteryEmpty : 'battery--empty';
    }
  }

  private getIconOrCssClassForWindGaugeModule(value: Battery, outputType: 'icon' | 'cssClass'): IconDefinition | string {
    if (value.vp > 5590) {
      return outputType === 'icon' ? faBatteryFull : 'battery--full';
    } else if (value.vp > 5180) {
      return outputType === 'icon' ? faBatteryThreeQuarters : 'battery--three-quarters';
    } else if (value.vp > 4770) {
      return outputType === 'icon' ? faBatteryHalf : 'battery--half';
    } else if (value.vp > 4360) {
      return outputType === 'icon' ? faBatteryQuarter : 'battery--quarter';
    } else {
      return outputType === 'icon' ? faBatteryEmpty : 'battery--empty';
    }
  }

  getNone(outputType: 'icon' | 'cssClass'): IconDefinition | string {
    return outputType === 'icon' ? faQuestion : 'battery--none';
  }
}
