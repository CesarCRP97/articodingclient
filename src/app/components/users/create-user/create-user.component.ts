import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { User } from 'app/models/User';
import { Router } from '@angular/router';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {
  formUser: FormGroup;
  constructor( private formBuilder: FormBuilder,
    private serverService: ServerService,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private router: Router) { }
    subRefs$: Subscription[] = [];

  user: User;
  rol: string;
  ngOnInit(): void {
    this.user = new User();
    this.formUser = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required],
      roles: [this.rol, Validators.required]
    });
  }

  CreateSimpleUser() {
  this.user.roles.push(this.rol);
    this.subRefs$.push(
      this.serverService.createUser(this.user)
      .subscribe(  res => {
        if (res.status === 200) {
          alert('creado!')
          this.dialogRef.close();
        } else {
          alert('Algo ha pasado... ' + res.status);
        }
      }, err => {
        alert('Algo ha pasado... ' + err);
      })
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
