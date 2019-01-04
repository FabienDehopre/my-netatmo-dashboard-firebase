export interface Country {
  name: string;
  topLevelDomain: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: string[];
  capital: string;
  altSpellings: string[];
  region: string;
  subregion: string;
  population: number;
  latlng: [number, number];
  denomyn: string;
  area: number;
  gini: number;
  timezones: string[];
  borders: string[];
  nativeName: string;
  numericCode: string;
  currencies: Array<{ code: string; name: string; symbol: string }>;
  languages: Array<{ iso639_1: string; iso639_2: string; name: string; nativeName: string }>;
  translations: {
    de: string;
    es: string;
    fr: string;
    ja: string;
    it: string;
    br: string;
    pt: string;
    nl: string;
    hr: string;
    fa: string;
  };
  flag: string;
  regionalBlocs: Array<{ acronym: string; name: string; otherAcronyms: string[]; otherNames: string[] }>;
  cioc: string;
}

export type Fields = keyof Country;

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania';

export enum RegionalBloc {
  EuropeanUnion = 'EU',
  EuropeanFreeTradeAssociation = 'EFTA',
  CaribbeanCommunity = 'CARICOM',
  PacificAlliance = 'PA',
  AfricanUnion = 'AU',
  UnionOfSouthAmericanNations = 'USAN',
  EurasianEconomicUnion = 'EEU',
  ArabLeague = 'AL',
  AssociationOfSoutheastAsianNations = 'ASEAN',
  CentralAmericanIntegrationSystem = 'CAIS',
  CentralEuropeanFreeTradeAgreement = 'CEFTA',
  NorthAmericanFreeTradeAgreement = 'NAFTA',
  SouthAsianAssociationForRegionalCooperation = 'SAARC',
}
