import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { IUserDetail } from 'app/models/IUserDetail';
import { UserDetail } from 'app/models/UserDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {

  constructor(    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef
    ) { }

    subRefs$: Subscription[] = [];
    user: IUserDetail = new UserDetail();
    userId:number;
    displayedCreatedLevels: string[] = ['id', 'title', 'active', 'actions'];
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
            console.log("holi holiii");
            this.user = res.body;
            this.formUser = this.formBuilder.group({
              username: [this.user.username],
              password: [''],
              enabled: [this.user.enabled],
            });
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => alert(err.error.message)

       // this.changeDetectorRefs.detectChanges();
      )
    );
  }

  editUser() {
    this.subRefs$.push(
      this.serverService.putUser(this.user.id, 
        { 
          username: this.user.username,
          password: this.formUser.controls.password.value,
          enabled: this.user.enabled
        }
      ).subscribe(  res => {
        if (res.status === 200) {
          this.getUser();
        } else alert('Algo ha pasado... ' + res.status);

      }, err => alert(err.error.message)
      )
    );
  }

  goLevel(idLevel: number) {
    const currentUrl = '/#/levels/' + idLevel;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goClassRoom(idClassRoom: number) {
    const currentUrl = '/#/classes/' + idClassRoom;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  toDisable(idLevel: number) {
    if(confirm('¿Está seguro de deshabilitar el nivel '+ idLevel + '?')) {
      this.subRefs$.push(
      this.serverService.putLevel(idLevel, { active : false}).subscribe(
        res => {
          if (res.status === 200) {
                this.getUser();
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => alert(err.error.message)

      ));
    } 
  }
  
  toEnable(idLevel: number) {
    if(confirm('¿Está seguro de habilitar el nivel '+ idLevel + '?')) {
      this.subRefs$.push(
        this.serverService.putLevel(idLevel, { active : true}).subscribe(
        res => {
          if (res.status === 200) {
                this.getUser();
          } else {
            alert('Algo ha pasado... ' + res.status);
          }
        }, err => alert(err.error.message)

      ));
    
    }   
  }

}
