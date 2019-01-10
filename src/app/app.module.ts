import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { FormsModule } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';

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
import { RainGaugeModuleComponent } from './components/rain-gauge-module/rain-gauge-module.component';
import { StationComponent } from './components/station/station.component';
import { WindGaugeModuleComponent } from './components/wind-gauge-module/wind-gauge-module.component';
import { MaterialModule } from './material.module';
import { CallbackComponent } from './pages/callback/callback.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutComponent } from './pages/logout.component';
import { AltitudePipe } from './pipes/altitude.pipe';
import { CountryPipe } from './pipes/country.pipe';
import { InjectorRef } from './services/injector-ref';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'redirect', // 'popup',
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      authMethod: 'https://accounts.google.com',
      clientId: '252006230321-vijp8et46l5vnfcsj3t7m5e543pdo4pg.apps.googleusercontent.com',
    },
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    // firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  tosUrl: '/todo-tos',
  privacyPolicyUrl: '/todo-privacy',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

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
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
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
