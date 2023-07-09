import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
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

        return next.handle(request);
    }
}