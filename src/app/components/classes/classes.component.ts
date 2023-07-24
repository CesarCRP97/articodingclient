import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServerService } from 'app/server.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { IClassRoom } from 'app/models/IClassRoom';
import { Subscription } from 'rxjs';
import { IPage } from 'app/models/IPage';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit {

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
  classRooms: IClassRoom[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['id','name', 'description','enabled','levels', 'teachers','students'];
  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
   this.getServerData(p);
  }

  public getServerData(event?:PageEvent){
    this.subRefs$.push(
      this.serverService.getClassRoms(event.pageIndex, event.pageSize)
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
        }, err => {
          alert('Algo ha pasado... ' + err);
        }

       // this.changeDetectorRefs.detectChanges();
      )
    );
    return event;
  }

  newClassRoom() {

  }


  ngOnDestroy(): void {
    this.subRefs$.forEach(r => {if(r){ r.unsubscribe();} })
   }

}
