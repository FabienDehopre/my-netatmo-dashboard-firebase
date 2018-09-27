import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(readonly afAuth: AngularFireAuth) {}

  ngOnInit() {}

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
