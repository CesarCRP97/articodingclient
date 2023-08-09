import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelDetail } from 'app/models/LevelDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-level-detail',
  templateUrl: './level-detail.component.html'
})
export class LevelDetailComponent implements OnInit {

  levelId:number;
  subRefs$: Subscription[] = [];
  level:LevelDetail;
  formLevel: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.levelId = this.activateRoute['_routerState'].snapshot.url.split('/')[2];
    this.getLevel();
  }

  getLevel(){
    this.subRefs$.push(
      this.serverService.getLevel(this.levelId)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.level = res.body;
            this.formLevel = this.formBuilder.group({
              title: [this.level.title],
              description: [this.level.description],
              publicLevel: [this.level.publicLevel],
              active: [this.level.active],
              owner: [this.level.owner],
              classRooms: [this.level.classRooms]
            });
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
      )
    );
  }

  editLevel(){
    this.subRefs$.push(
      this.serverService.putLevel(this.levelId, 
        { 
          title: this.formLevel.controls.title.value,
          description: this.formLevel.controls.description.value,
          publicLevel: this.level.publicLevel,
          active: this.level.active
        }
      ).subscribe(  res => {
        if (res.status === 200) {
          this.getLevel();
        } else alert('Algo ha pasado... ' + res.status);
      }, err => alert(err.error.message)
      )
    );
  }

  goClassRooms(){
    const currentUrl = '/#/classes?levelId=' + this.levelId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }
}
