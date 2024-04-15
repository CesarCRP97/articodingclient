import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServerService } from 'app/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { IClassRoom } from 'app/models/IClassRoom';
import { Subscription } from 'rxjs';
import { IPage } from 'app/models/IPage';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html'
})
export class ClassesComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
  ) { }

  subRefs$: Subscription[] = [];
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  classRooms: IClassRoom[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['id','name','key', 'description','enabled','levels', 'teachers','students'];
  levelId: number = null;
  userId:number = null; 
  teacherId:number = null;
  filter = "";
  isFilter = false;
  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
    if (this.activateRoute.queryParams['_value']) {
      
      if(this.activateRoute.queryParams['_value']['levelId']) {
        this.levelId = this.activateRoute.queryParams['_value']['levelId'];
      }
      if(this.activateRoute.queryParams['_value']['userId']) {
        this.userId = this.activateRoute.queryParams['_value']['userId'];
      }
      if(this.activateRoute.queryParams['_value']['teacherId']) {
        this.userId = this.activateRoute.queryParams['_value']['teacherId'];
      }
    }

   this.getServerData(p);
  }

  public getServerData(event?:PageEvent){
    this.subRefs$.push(
      this.serverService.getClassRooms(event.pageIndex, event.pageSize, this.levelId, this.userId, this.teacherId, this.filter != ''? this.filter : null)
      .subscribe(
        res => {
          if (res.status === 200) {
            let response: IPage<IClassRoom> = res.body;
            this.classRooms = response.content;
            this.loadTable = true;
            this.pageIndex = response.pageable.pageNumber;
            this.pageSize = response.pageable.pageSize;
            this.length = response.totalElements;
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => alert(err.error.message)

       // this.changeDetectorRefs.detectChanges();
      )
    );
    return event;
  }

  goStudents(classId: number) {
    const currentUrl = '/#/users?classId=' + classId + '&teacher=false';
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }
  goTeachers(classId: number) {
    const currentUrl = '/#/users?classId=' + classId + '&teacher=true';
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goLevels(levelId: number) {
    const currentUrl = '/#/levels?classId=' + levelId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goClase(classId: number) {
    const currentUrl = '/#/classes/' + classId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });  
  }

  newClassRoom() {
    const currentUrl = '/#/classes/new';
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    }); 
  }

  
  putFilter() {
    this.isFilter = true;
    this.pageIndex = 0;
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = this.pageSize;
    this.getServerData(p);
  }

  quitFilter() {
    this.isFilter = false;
    this.filter = '';
    this.pageIndex = 0;
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = this.pageSize;
    this.getServerData(p);
  }

  ngOnDestroy(): void {
    this.subRefs$.forEach(r => {if(r){ r.unsubscribe();} })
   }

}
