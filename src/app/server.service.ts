import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ILink } from './models/ILink';
import { ILogin } from './models/ilogin';
import { IPage } from './models/IPage';
import { IResponse } from './models/iresponse';
import { IUser } from './models/IUser';
import { User } from './models/User';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  //host:string = "http://13.48.149.249:8080/";
    host:string = "http://localhost:8080/";
  authorized: boolean = false;


  constructor(private http: HttpClient) { 
  }

  login(user: ILogin): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.host + 'login', 
    user, { observe: 'response'});
  }

  getUsers(page:number, size:number):Observable<HttpResponse<IPage<IUser>>> {
    const url = this.host + 'users?page=' + page + '&size=' + size;
    return this.http.get<IPage<IUser>>(url, 
      { observe: 'response' });
  }

  createUser(user: User):Observable<HttpResponse<ILink>> {
    const url = this.host + 'users';
    return this.http.post<ILink>(url, user,
      { observe: 'response' });
  }
  

}
