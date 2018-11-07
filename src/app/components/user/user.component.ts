import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserDisplay } from 'src/app/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent {
  @Input()
  user: UserDisplay;
}
