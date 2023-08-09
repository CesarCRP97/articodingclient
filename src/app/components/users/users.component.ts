import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'app/models/IUser';
import { IPage } from 'app/models/IPage';
import { ServerService } from 'app/server.service';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit, OnDestroy {

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
  users: IUser[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['id', 'username', 'enabled', 'role'];
  classId: number = null;
  teacher:boolean = null;

  
  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
    if (this.activateRoute.queryParams['_value']) {
      if(this.activateRoute.queryParams['_value']['classId']) {
        this.classId = this.activateRoute.queryParams['_value']['classId'];
        this.teacher = this.activateRoute.queryParams['_value']['teacher'];
      }
   }
   this.getServerData(p);

  }
  public getServerData(event?:PageEvent){
    
    this.subRefs$.push(
      this.serverService.getUsers(event.pageIndex, event.pageSize, this.classId, this.teacher)
      .subscribe(
        res => {
        
          if (res.status === 200) {
            let response: IPage<IUser> = res.body;
            this.users = response.content;
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

  newUser() {
    const currentUrl = '/#/users/new';
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goUser(idUser:number) {
    const currentUrl = '/#/users/' + idUser;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  ngOnDestroy(): void {
   this.subRefs$.forEach(r => {if(r){ r.unsubscribe();} })
  }
}
