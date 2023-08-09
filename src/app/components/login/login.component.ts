
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

  formLogin: FormGroup;
  subRef$: Subscription;
  isError: boolean = false;
  errorMensaje; string;
  
  constructor(
    private formBuilder: FormBuilder,
    private serverService: ServerService,
    private router: Router
  ) { 
    this.formLogin = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  Login() {
    const usuarioLogin: ILogin = {
      username: this.formLogin.value.username,
      password: this.formLogin.value.password,
    }
    this.subRef$ = this.serverService.login(usuarioLogin)
      .subscribe(response => {
        if (response) {
          const token = response.body.token;
            console.log('Token -> ', token);
            sessionStorage.setItem('token','Bearer ' + token );
            sessionStorage.setItem('username', this.formLogin.value.username)
            this.router.navigate(['/users'])
        } else {

        }
      }, err => {
        this.errorMensaje = err.error.message;
        this.isError = true;
        this.formLogin.reset();
      });
  }

  ngOnDestroy(): void {
    if(this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

}
