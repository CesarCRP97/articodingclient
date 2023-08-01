import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ngZone: NgZone) {
      this.title = data.title;
      this.content = data.content;
    }
  title:string;
  content:string;

  ngOnInit(): void {
  }

  close(result:boolean) {
    this.ngZone.run(() => {
      this.dialogRef.close(result);
    });
  }

}
