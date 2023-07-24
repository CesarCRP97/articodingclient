import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ILevel } from 'app/models/Ilevel';
import { IPage } from 'app/models/IPage';
import { ServerService } from 'app/server.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent implements OnInit {

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
  levels: ILevel[];
  loadTable:boolean = false;
  displayedColumns: string[] = ['id','title', 'description','active','publicLevel', 'classRooms','owner'];
  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
   this.getServerData(p);
  }

  public getServerData(event?:PageEvent){
    this.subRefs$.push(
      this.serverService.getLevels(event.pageIndex, event.pageSize)
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
        }, err => {
          alert('Algo ha pasado... ' + err);
        }

       // this.changeDetectorRefs.detectChanges();
      )
    );
    return event;
  }

  newlevel() {

  }


  ngOnDestroy(): void {
    this.subRefs$.forEach(r => {if(r){ r.unsubscribe();} })
   }

}
