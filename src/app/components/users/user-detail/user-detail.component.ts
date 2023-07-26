import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IUserDetail } from 'app/models/IUserDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  constructor(    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
    ) { }

    subRefs$: Subscription[] = [];
    user: IUserDetail;
    userId:number;
    loaded = false;
    read = true;
    displayedCreatedLevels: string[] = ['id', 'title'];
    displayedCreatedClassRooms: string[] = ['id', 'name'];
    formUser: FormGroup;

  ngOnInit(): void {
  this.userId = this.activateRoute['_routerState'].snapshot.url.split('/')[2];
    this.getUser();

  }

  getUser():void {

    this.subRefs$.push(
      this.serverService.getUser(this.userId)
      .subscribe(
        res => {
        
          if (res.status === 200) {
            this.user = res.body;
            this.formUser = this.formBuilder.group({
              username: [this.user.username, Validators.required],
              enabled: [this.user.enabled, Validators.required],
            });

            this.loaded = true;
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => {
          alert('Algo ha pasado... ' + err);
        }

       // this.changeDetectorRefs.detectChanges();
      )
    );
  }

  goLevel(idLevel: number) {

  }
  
  goClassRoom(idClassRoom: number) {

  }
}
