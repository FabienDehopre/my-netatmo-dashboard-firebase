import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(readonly afAuth: AngularFireAuth, private readonly afs: AngularFirestore) {}

  ngOnInit() {}

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
