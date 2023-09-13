import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ILevel } from 'app/models/Ilevel';
import { IPage } from 'app/models/IPage';
import { ServerService } from 'app/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html'
})
export class LevelsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private activatedRouter: ActivatedRoute,
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
  levels: ILevel[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['id','title', 'description','active','publicLevel', 'classRooms','owner'];
  classId: number = null;
  userId:number = null; 
  filter = "";
  isFilter = false;
  
  ngOnInit(): void {
      const p: PageEvent =new PageEvent();
      p.pageIndex = 0;
      p.pageSize = 5;
      if (this.activateRoute.queryParams['_value']) {
        
        if(this.activateRoute.queryParams['_value']['classId']) {
          this.classId = this.activateRoute.queryParams['_value']['classId'];
        }
        if(this.activateRoute.queryParams['_value']['userId']) {
          this.userId = this.activateRoute.queryParams['_value']['userId'];
        }
      }
      this.getServerData(p);
  }

  public getServerData(event?:PageEvent){
    debugger
    this.subRefs$.push(
      this.serverService.getLevels(event.pageIndex, event.pageSize, this.classId, this.userId, this.filter != ''? this.filter : null)
      .subscribe(
        res => {
          if (res.status === 200) {
            let response: IPage<ILevel> = res.body;
            this.levels = response.content;
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

  newlevel() {

  }

  goUser(idUser: number) {
    const currentUrl = '/#/users/' + idUser;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goClassRoom(idLevel: number) {
    const currentUrl = '/#/classes?levelId=' + idLevel;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goLevel(idLevel:number) {
    const currentUrl = '/#/levels/' + idLevel;
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
