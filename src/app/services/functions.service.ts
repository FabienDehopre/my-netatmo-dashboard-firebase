import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {
  private readonly firstFetchAndUpdateHttp: (data: any) => Observable<number>;

  constructor(fns: AngularFireFunctions) {
    this.firstFetchAndUpdateHttp = fns.httpsCallable('firstFetchAndUpdateHttp');
  }

  fetchAndUpdateFirstWeatherData(): Observable<number> {
    return this.firstFetchAndUpdateHttp({});
  }
}
