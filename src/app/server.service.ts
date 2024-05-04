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
import { ILevelWithImage } from './models/ILevel';
import { IUserDetail } from './models/IUserDetail';
import { LevelDetail } from './models/LevelDetail';
import { ClassRoomDetail } from './models/ClassRoomDetail';
import { environment } from '../environments/environment';
import { IPlaylist } from './models/IPlaylist';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  host:string;
  authorized: boolean = false;


  constructor(private http: HttpClient) { 
    this.host = environment.host;
  }

  public login(user: ILogin): Observable<HttpResponse<IResponse>> {
    return this.http.post<IResponse>(this.host + 'login', 
    user, { observe: 'response'});
  }

  /** USERS */

  public getUsers(
    page:number, size:number,
    classId?: number,
    teacher?: boolean,
    filter:string = null
  ):Observable<HttpResponse<IPage<IUser>>> {
    var url = this.host + 'users?page=' + page + '&size=' + size + 
    (filter?"&title=" + filter:"");
    if (classId) {
      url = url + '&class=' + classId + '&teacher=' + teacher;
    }
    return this.http.get<IPage<IUser>>(url, 
      { observe: 'response' });
  }

  public getUser(userId: number):Observable<HttpResponse<IUserDetail>> {
    var url = this.host + 'users/' + userId;
    return this.http.get<IUserDetail>(url, 
      { observe: 'response' });
  }

  public createUser(user: User):Observable<HttpResponse<ILink>> {
    const url = this.host + 'users';
    return this.http.post<ILink>(url, user,
      { observe: 'response' });
  }

  public createUsers(users: User[]) {
    const url = this.host + 'users/list';
    return this.http.post<ILink>(url, users,
      { observe: 'response' });
  }

  public putUser(id:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'users/' + id;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  /** CLASS ROOMS */

  public getClassRooms(
    page: number, size: number,
    levelId?: number,
    userId?: number,
    teacherId?: number,
    filter:string = null
  ):Observable<HttpResponse<IPage<IClassRoom>>> {
    var url = this.host + 'classes?page=' + page + '&size=' + size + 
    (filter?"&title=" + filter:"");
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

  public getClassRoom(classRoomId: number):Observable<HttpResponse<ClassRoomDetail>> {
    var url = this.host + 'classes/' + classRoomId;
    return this.http.get<ClassRoomDetail>(url, 
      { observe: 'response' });
  }

  public putClassRoom(classRoomId:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  public postClassRoom(json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }

    /** CLASES -> NIVELES */
  public addLevelsToClass(classRoomId: number, json: object[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/levels';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }

  public deleteLevelsOfClass(classRoomId: number, levelId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/levels/' + levelId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }

  /** CLASES -> PROFESORES */
  public addTeachersToClass(classRoomId: number, json: string[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/teachers';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }
  public deleteTeacherOfClass(classRoomId: number, teacherId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/teachers/' + teacherId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }
  /** CLASES -> ESTUDIANTES */
  public addStudentsToClass(classRoomId: number, json: string[]):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/students';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }
  public deleteStudentOfClass(classRoomId: number, studentsId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'classes/' + classRoomId + '/students/' + studentsId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }
  /** LEVELS */

  public getLevels(page: number, size: number,
    classId?: number,
    userId?: number, 
    filter:string = null
  ):Observable<HttpResponse<IPage<ILevelWithImage>>> {
   debugger 
   var url = this.host + 'levels?page=' + page + '&size=' + size + 
    (filter?"&title=" + filter:"");

    if(classId) {
      url = url + '&class=' + classId;
    } else if(userId){
      url = url + '&user=' + userId;
    }
    return this.http.get<IPage<ILevelWithImage>>(url, 
      { observe: 'response' });
  }

  public getLevel(levelId: number):Observable<HttpResponse<ILevelWithImage>> {
      var url = this.host + 'levels/' + levelId;
      return this.http.get<ILevelWithImage>(url, 
        { observe: 'response' });
  }
  
  public putLevel(id:number, json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'levels/' + id;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }


  /** PLAYLISTS */
  public getPlaylists(
    page: number, size: number,
    userId?: number,
    playslistId?: number,
    filter: string = null
  ): Observable<HttpResponse<IPage<IPlaylist>>> {
    debugger 
    var url = this.host + 'playlists?page=' + page + '&size=' + size + 
     (filter?"&title=" + filter:"");
 
     if(playslistId) {
       url = url + '&playlist=' + playslistId;
     } else if(userId){
       url = url + '&user=' + userId;
     }
     return this.http.get<IPage<IPlaylist>>(url, 
       { observe: 'response' });
   }

   public getPlaylist(playlistId: number):Observable<HttpResponse<IPlaylist>> {
       var url = this.host + 'playlists/' + playlistId;
       return this.http.get<IPlaylist>(url, 
         { observe: 'response' });
   }

   /** PLAYLIST -> NIVELES */

  public addLevelsToPlaylist(playlistId: number, json: object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'playlists/' + playlistId;
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  public deleteLevelOfPlaylist(playlistId: number, levelId: string):Observable<HttpResponse<ILink>> {
    const url = this.host + 'playlists/' + playlistId + '/levels/' + levelId;
    return this.http.delete<ILink>(url, { observe: 'response' });
  }

  public putPlaylist(json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'playlists';
    return this.http.put<ILink>(url, json, { observe: 'response' });
  }

  public postPlaylist(json:object):Observable<HttpResponse<ILink>> {
    const url = this.host + 'playlists';
    return this.http.post<ILink>(url, json, { observe: 'response' });
  }
}
