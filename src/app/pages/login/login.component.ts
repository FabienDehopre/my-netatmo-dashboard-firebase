import { Component, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @ViewChild('signInFailure', { read: TemplateRef })
  signInFailure: TemplateRef<any>;

  constructor(private readonly router: Router, private readonly zone: NgZone, private readonly snackBar: MatSnackBar) {}

  signInSuccess(result: FirebaseUISignInSuccessWithAuthResult): void {
    if (result != null && result.authResult != null) {
      this.zone.run(() => {
        if (result.redirectUrl != null) {
          this.router.navigateByUrl(result.redirectUrl);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }

  signInFail(failure: FirebaseUISignInFailure): void {
    this.snackBar.openFromTemplate(this.signInFailure, {
      data: failure,
      duration: 60000,
      politeness: 'assertive',
      panelClass: 'snack-bar-failure',
    });
  }
}
