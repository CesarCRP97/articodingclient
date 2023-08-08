import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { User } from 'app/models/User';
import { Router } from '@angular/router';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {
  formUser: FormGroup;
  formAdvanceUser: FormGroup;

  advanceUser: string = '' ;
  simple:boolean = true;

  constructor( private formBuilder: FormBuilder,
    private serverService: ServerService,
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
            const currentUrl = '/#' + res.body.link;
            this.router.navigateByUrl(currentUrl).then(() => {
              window.location.reload();
            });
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => {
          alert('Algo ha pasado... ' + err);
        })
      );
  }

  CreateAdvanceUser() { 
    var lines: string[] = this.advanceUser.split('\n');
    const users: User[] = [];
    lines.forEach(line => {
      var columns: string[] = line.split(';');
      if(columns.length == 1 && columns[0] === "") {

      } else {
        if (columns.length < 3) {
          this.addError();
       }
       const newUser:User = new User();
       newUser.username = columns[0];
       newUser.password = columns[1];
       var roles: string[] = [];
       roles.push(columns[2]);
       newUser.roles = roles;
       newUser.enabled = true;
       if (columns.length > 3) {
        var clases: number[];
        clases = columns[3].split(',').map(n => Number(n));
        newUser.classes = clases;
       }
       users.push(newUser);
      }
    });

    this.subRefs$.push(
      this.serverService.createUsers(users)
      .subscribe(  res => {
        if (res.status === 200) {
          const currentUrl = '/#' + res.body.link;
          this.router.navigateByUrl(currentUrl).then(() => {
            window.location.reload();
          });
        } else {
          alert('Algo ha pasado... ' + res.status);
        }
      }, err => alert(err.error.message))
    );
  }

  addError() {

  }

}
