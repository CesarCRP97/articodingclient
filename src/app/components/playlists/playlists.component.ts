import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ServerService } from 'app/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { IPage } from 'app/models/IPage';
import { IPlaylist } from 'app/models/IPlaylist';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
})
export class PlaylistsComponent implements OnInit {
  private subRefs$: Subscription[] = [];
  pageEvent: PageEvent;
  datasource: null;
  pageIndex:number;
  pageSize:number;
  length:number;
  public playlists: IPlaylist[];
  loadTable: boolean = false;
  public displayedColumns: string[] = ['id', 'title'];
  levelId: number = null;
  userId: number = null;
  playlistId: number = null;
  public filter = "";
  public isFilter = false;


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const p: PageEvent =new PageEvent();
    p.pageIndex = 0;
    p.pageSize = 5;
    /**
    if (this.activateRoute.queryParams['_value']) {
      
      if(this.activateRoute.queryParams['_value']['levelId']) {
        this.levelId = this.activateRoute.queryParams['_value']['levelId'];
      }
    }
    */
    this.getServerData(p);
  }

  public getServerData(event?: PageEvent){
    
    this.subRefs$.push(
      this.serverService.getPlaylists(
        event.pageIndex, event.pageSize,
        this.userId, this.playlistId, 
        this.filter != ''? this.filter : null
      ).subscribe({
        next: res => {
          if (res.status === 200) {
            const response: IPage<IPlaylist> = res.body;
            this.playlists = response.content;
            this.loadTable = true;
            this.pageIndex = response.pageable.pageNumber;
            this.pageSize = response.pageable.pageSize;
            this.length = response.totalElements;
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        },
        error: err => alert(err.error.message)
      })
    );
  }

  public goPlaylist(playlistId: number) {
    const currentUrl = '/#/playlists/' + playlistId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  public newPlaylist() {
    const currentUrl = '/#/playlists/new';
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
    this.subRefs$.forEach(sub => sub.unsubscribe());
  }
}
