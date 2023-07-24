import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'app/models/IUser';
import { IPage } from 'app/models/IPage';
import { ServerService } from 'app/server.service';
import { Observable, Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog
  ) { }

  subRefs$: Subscription[] = [];
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  users: IUser[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['username', 'enabled', 'roles'];
  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
   this.getServerData(p);
  }
  public getServerData(event?:PageEvent){
    this.subRefs$.push(
      this.serverService.getUsers(event.pageIndex, event.pageSize)
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
        }, err => {
          alert('Algo ha pasado... ' + err);
        }

       // this.changeDetectorRefs.detectChanges();
      )
    );
    return event;
  }

  newUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {

    });
    
  }

  ngOnDestroy(): void {
   this.subRefs$.forEach(r => {if(r){ r.unsubscribe();} })
  }
}
