import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IClassRoom } from './models/IClassRoom';
import { ILink } from './models/ILink';
import { ILogin } from './models/ilogin';
import { IPage } from './models/IPage';
import { IResponse } from './models/iresponse';
import { IUser } from './models/IUser';
import { User } from './models/User';
import { ILevel } from './models/Ilevel';
import { IUserDetail } from './models/IUserDetail';
import { LevelDetail } from './models/LevelDetail';
import { ClassRoomDetail } from './models/ClassRoomDetail';

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

  /** USERS */

  getUsers(page:number, size:number, classId: number, teacher: boolean):Observable<HttpResponse<IPage<IUser>>> {
    var url = this.host + 'users?page=' + page + '&size=' + size;
    if (classId) {
      url = url + '&class=' + classId + '&teacher=' + teacher;
    }
    return this.http.get<IPage<IUser>>(url, 
      { observe: 'response' });
  }

  getUser(userId: number):Observable<HttpResponse<IUserDetail>> {
    var url = this.host + 'users/' + userId;
    return this.http.get<IUserDetail>(url, 
      { observe: 'response' });
  }

  createUser(user: User):Observable<HttpResponse<ILink>> {
    const url = this.host + 'users';
    return this.http.post<ILink>(url, user,
      { observe: 'response' });
  }

  createUsers(users: User[]) {
    const url = this.host + 'users/list';
    return this.http.post<ILink>(url, users,
      { observe: 'response' });
  }

  putUser(id:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'users/' + id;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  /** CLASS ROOMS */

  getClassRooms(page: number, size: number,levelId: number, userId: number, teacherId: number):Observable<HttpResponse<IPage<IClassRoom>>> {
    var url = this.host + 'classes?page=' + page + '&size=' + size;
    if(levelId) {
      url = url + '&level=' + levelId;
    } else if(userId){
      url = url + '&user=' + userId;
    }else if(teacherId){
      url = url + '&teacherId=' + teacherId;
    }

    return this.http.get<IPage<IClassRoom>>(url, 
      { observe: 'response' });
  }

  getClassRoom(classRoomId: number):Observable<HttpResponse<ClassRoomDetail>> {
    var url = this.host + 'classes/' + classRoomId;
    return this.http.get<ClassRoomDetail>(url, 
      { observe: 'response' });
  }

  putClassRoom(classRoomId:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  postClassRoom(json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }

    /** CLASES -> NIVELES */
  addLevelsToClass(classRoomId: number, json: object[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/levels';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }

  deleteLevelsOfClass(classRoomId: number, levelId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/levels/' + levelId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }

  /** CLASES -> PROFESORES */
  addTeachersToClass(classRoomId: number, json: object[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/teachers';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }
  deleteTeacherOfClass(classRoomId: number, teacherId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/teachers/' + teacherId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }
  /** CLASES -> ESTUDIANTES */
  addStudentsToClass(classRoomId: number, json: object[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/students';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }
  deleteStudentOfClass(classRoomId: number, studentsId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/students/' + studentsId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }
  /** LEVELS */

  getLevels(page: number, size: number,classId: number, userId: number):Observable<HttpResponse<IPage<ILevel>>> {
    var url = this.host + 'levels?page=' + page + '&size=' + size;
    if(classId) {
      url = url + '&class=' + classId;
    } else if(userId){
      url = url + '&user=' + userId;
    }

    return this.http.get<IPage<ILevel>>(url, 
      { observe: 'response' });
  }

  getLevel(levelId: number):Observable<HttpResponse<LevelDetail>> {
      var url = this.host + 'levels/' + levelId;
      return this.http.get<LevelDetail>(url, 
        { observe: 'response' });
  }
  
  putLevel(id:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'levels/' + id;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

}
