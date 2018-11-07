import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-authorize-dialog',
  templateUrl: './authorize-dialog.component.html',
  styleUrls: ['./authorize-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizeDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<AuthorizeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly netatmoAuthorize: string
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }
}
