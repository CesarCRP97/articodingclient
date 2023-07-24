import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IClassRoom } from './models/IClassRoom';
import { ILevel } from './models/Ilevel';
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

  getClassRoms(page: number, size: number):Observable<HttpResponse<IPage<IClassRoom>>> {
    const url = this.host + 'classes?page=' + page + '&size=' + size;
    return this.http.get<IPage<IClassRoom>>(url, 
      { observe: 'response' });
  }

  getLevels(page: number, size: number):Observable<HttpResponse<IPage<ILevel>>> {
    const url = this.host + 'levels?page=' + page + '&size=' + size;
    return this.http.get<IPage<ILevel>>(url, 
      { observe: 'response' });
  }
  

}
