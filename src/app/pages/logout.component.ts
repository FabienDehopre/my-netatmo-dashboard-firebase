import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-logout',
  template: `
    Please wait
  `,
})
export class LogoutComponent implements OnInit {
  constructor(private readonly userService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.userService.signOut();
    this.router.navigate(['/']);
  }
}
