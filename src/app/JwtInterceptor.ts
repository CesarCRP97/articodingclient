import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LoadingService } from './LoadingService';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(  private _loading: LoadingService,
        private router: Router,) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url

        const id = Date.now();
        
        this._loading.setLoading(true, id + '');

        const token = sessionStorage.getItem('token');
        const role = sessionStorage.getItem('role');
        if (role == 'ROLE_USER') {
            const currentUrl = '/#/login';
            this.router.navigateByUrl(currentUrl).then(() => {
              window.location.reload();
            });
        }
        if (token) {
            request = request.clone({
                setHeaders: {
                    'Authorization': token ,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With,observe',
                    'Access-Control-Max-Age': '3600',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Expose-Headers': 'Authorization'
                }
            });

        }

        return next.handle(request)
        .pipe(catchError((err) => {
            this._loading.setLoading(false, id + '');
            if(err.status === 403 || err.sttus === 401) {
                const currentUrl = '/#/login';
                this.router.navigateByUrl(currentUrl).then(() => {
                  window.location.reload();
                });
            }
            return throwError(err);
          }))
          .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
            if(evt.hasOwnProperty('status')) {
                this._loading.setLoading(false, id + '');
            }
            return evt;
          }));
    }
}