
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from 'app/models/ilogin';
import { IResponse } from 'app/models/iresponse';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, OnDestroy {

  formLogin: FormGroup;
  subRef$: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
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

    this.subRef$ =  this.http.post<IResponse>('http://13.48.149.249:8080/login', 
    usuarioLogin, { observe: 'response'})
    .subscribe(response => {
      if (response) {
        const token = response.body.token;
          console.log('Token -> ', token);
          sessionStorage.setItem('token', token );
          this.router.navigate(['/home'])
      } else {

      }
    }, err => {
      console.log('Error de login -> ', err);
    });
  }

  ngOnDestroy(): void {
    if(this.subRef$) {
      this.subRef$.unsubscribe();
    }
  }

}
