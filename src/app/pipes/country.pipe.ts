import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Country } from '../models/country';
import { Language } from '../models/language';
import { RestCountriesService } from '../services/rest-countries.service';

@Pipe({ name: 'country' })
export class CountryPipe implements PipeTransform {
  constructor(private readonly restCountriesService: RestCountriesService) {}

  transform(countryCode: string, lang: Language): Observable<string> {
    return this.restCountriesService.getByCode(countryCode, 'name', 'translations').pipe(
      map((country: Pick<Country, 'name' | 'translations'>) => {
        if (lang === 'en') {
          return country.name;
        } else {
          return country.translations[lang];
        }
      })
    );
  }
}
