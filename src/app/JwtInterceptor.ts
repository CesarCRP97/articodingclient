import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { LoadingService } from './LoadingService';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(  private _loading: LoadingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url

        const id = Date.now();
        
        this._loading.setLoading(true, id + '');

        const token = sessionStorage.getItem('token');
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
            return err;
          }))
          .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
            if(evt.hasOwnProperty('status')) {
                this._loading.setLoading(false, id + '');
            }
            return evt;
          }));
    }
}