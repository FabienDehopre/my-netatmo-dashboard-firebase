import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Country, Fields, Region, RegionalBloc } from '../models/country';

const REST_COUNTRIES_BASE_URL = 'https://restcountries.eu/rest/v2';

@Injectable({
  providedIn: 'root',
})
export class RestCountriesService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll(): Observable<Country[]>;
  getAll(field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getAll(field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[] | Array<Partial<Country>>>(`${REST_COUNTRIES_BASE_URL}/all${fields}`);
  }

  getByName(name: string): Observable<Country[]>;
  getByName(name: string, field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByName(name: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[] | Array<Partial<Country>>>(`${REST_COUNTRIES_BASE_URL}/name/${name}${fields}`);
  }

  getByFullName(name: string): Observable<Country[]>;
  getByFullName(name: string, field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByFullName(name: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields, '&');
    return this.httpClient.get<Country[] | Array<Partial<Country>>>(`${REST_COUNTRIES_BASE_URL}/name/${name}?fullText=true${fields}`);
  }

  getByCode(code: string): Observable<Country>;
  getByCode(code: string, field1: Fields, ...otherFields: Fields[]): Observable<Partial<Country>>;
  getByCode(code: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country | Partial<Country>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country | Partial<Country>>(`${REST_COUNTRIES_BASE_URL}/alpha/${code}${fields}`);
  }

  getByCodes(codes: string[]): Observable<Country[]>;
  getByCodes(codes: string[], field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByCodes(codes: string[], field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields, '&');
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/alpha?codes=${codes.join(';')}${fields}`);
  }

  getByCurrency(currency: string): Observable<Country[]>;
  getByCurrency(currency: string, field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByCurrency(currency: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/currency/${currency}${fields}`);
  }

  getByLanguage(lang: string): Observable<Country[]>;
  getByLanguage(lang: string, field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByLanguage(lang: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/lang/${lang}${fields}`);
  }

  getByCapital(capital: string): Observable<Country[]>;
  getByCapital(capital: string, field1: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByCapital(capital: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/capital/${capital}${fields}`);
  }

  getByCallingCode(callingCode: string): Observable<Country[]>;
  getByCallingCode(callingCode: string, field1?: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByCallingCode(callingCode: string, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/callingcode/${callingCode}${fields}`);
  }

  getByRegion(region: Region): Observable<Country[]>;
  getByRegion(region: Region, field1?: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByRegion(region: Region, field1?: Fields, ...otherFields: Fields[]): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/region/${region}${fields}`);
  }

  getByRegionalBloc(regionalBloc: RegionalBloc): Observable<Country[]>;
  getByRegionalBloc(regionalBloc: RegionalBloc, field1?: Fields, ...otherFields: Fields[]): Observable<Array<Partial<Country>>>;
  getByRegionalBloc(
    regionalBloc: RegionalBloc,
    field1?: Fields,
    ...otherFields: Fields[]
  ): Observable<Country[] | Array<Partial<Country>>> {
    const fields = this.serializeFields(field1, otherFields);
    return this.httpClient.get<Country[]>(`${REST_COUNTRIES_BASE_URL}/regionalbloc/${regionalBloc}${fields}`);
  }

  private serializeFields(field1?: Fields, otherFields?: Fields[], separator: '?' | '&' = '?'): string {
    let fields = '';
    if (field1) {
      fields = `${separator}fields=${field1}`;
      if (otherFields != null && otherFields.length > 0) {
        fields = `;${otherFields.join(';')}`;
      }
    }

    return fields;
  }
}
