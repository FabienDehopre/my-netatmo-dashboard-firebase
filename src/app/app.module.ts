import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorizeDialogComponent } from './components/authorize-dialog/authorize-dialog.component';
import { BatteryComponent } from './components/battery/battery.component';
import { CallbackErrorDialogComponent } from './components/callback-error-dialog/callback-error-dialog.component';
import { IndoorModuleComponent } from './components/indoor-module/indoor-module.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LocationComponent } from './components/location/location.component';
import { MainModuleComponent } from './components/main-module/main-module.component';
import { OutdoorModuleComponent } from './components/outdoor-module/outdoor-module.component';
import { RadioComponent } from './components/radio/radio.component';
import { RainGaugeModuleComponent } from './components/rain-gauge-module/rain-gauge-module.component';
import { StationComponent } from './components/station/station.component';
import { WifiComponent } from './components/wifi/wifi.component';
import { WindGaugeModuleComponent } from './components/wind-gauge-module/wind-gauge-module.component';
import { MaterialModule } from './material.module';
import { CallbackComponent } from './pages/callback/callback.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout.component';
import { AltitudePipe } from './pipes/altitude.pipe';
import { CountryPipe } from './pipes/country.pipe';
import { InjectorRef } from './services/injector-ref';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CallbackComponent,
    LogoutComponent,
    LayoutComponent,
    AuthorizeDialogComponent,
    CallbackErrorDialogComponent,
    StationComponent,
    LocationComponent,
    CountryPipe,
    AltitudePipe,
    MainModuleComponent,
    OutdoorModuleComponent,
    IndoorModuleComponent,
    WindGaugeModuleComponent,
    RainGaugeModuleComponent,
    BatteryComponent,
    WifiComponent,
    RadioComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    HttpClientModule,
    NgxAuthFirebaseUIModule.forRoot(environment.firebase),
    MaterialModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [AuthorizeDialogComponent, CallbackErrorDialogComponent],
  providers: [{ provide: FunctionsRegionToken, useValue: 'us-central1' }],
})
export class AppModule {
  // tslint:disable-next-line:no-unused-variable
  // @ts-ignore
  constructor(injectorRef: InjectorRef, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
    // matIconRegistry.addSvgIconSetInNamespace('mdi', domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
