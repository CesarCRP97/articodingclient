
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ILogin } from '../../models/ilogin';
import { IResponse } from '../../models/iresponse';
import { ServerService } from 'app/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, OnDestroy {


  subRef$: Subscription;
  isError: boolean = false;
  errorMensaje;
  public username: string = '';
  public password: string = '';
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private router: Router
  ) { 
  }

  ngOnInit(): void {

  }

  Login() {
    const usuarioLogin: ILogin = {
      username: this.username,
      password: this.password,
    }
    this.subRef$ = this.serverService.login(usuarioLogin)
      .subscribe(response => {
        if (response) {
          const token = response.body.token;
            console.log('Token -> ', token);
            sessionStorage.setItem('token','Bearer ' + token );
            sessionStorage.setItem('username', this.username)
            sessionStorage.setItem('role',  response.body.role)
            if(response.body.role == "ROLE_USER") {
              alert("El usuario no tiene permisos para acceder a la web")
            } else {
              this.router.navigate(['/users'])
            }
 
        } else {

        }
      }, err => {
        this.errorMensaje = err.error.message;
        this.isError = true;
        this.username = '';
        this.password = '';
      });
  }

  ngOnDestroy(): void {
    if(this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

}
