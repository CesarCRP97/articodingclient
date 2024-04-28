import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { LevelsComponent } from 'app/components/levels/levels.component';
import { ClassRoomDetail } from 'app/models/ClassRoomDetail';
import { ILevel, ILevelWithImage } from 'app/models/ILevel';
import { IUser } from 'app/models/IUser';
import { PlaylistDetail } from 'app/models/PlaylistDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.component.html'
})
export class PlaylistDetailComponent implements OnInit {

  playlistId:number;

  subRefs$: Subscription[] = [];

  playlist: PlaylistDetail;
  

  // Rollover mostrar niveles y permitir anadir desde esta lista
  levelsComponent : LevelsComponent;

  isNew = false;

  formPlaylist: FormGroup;
  
  formLevels: FormGroup;

  //Campo en el que se anaden los ids de niveles "1,5,6,123" y luego se splitean y se anaden al formLevels
  newLevels: String;

  displayedLevels = ['id', 'title', 'active', 'actions'];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
    ) { 
      this.formLevels  =this.formBuilder.group({
        newLevels: [this.newLevels]});
    }

  ngOnInit(): void {
    var type:string = this.activateRoute['_routerState'].snapshot.url.split('/')[2];

    if(type != 'new') {
      this.playlistId = Number(type);
      this.getPlaylist();
      //todo crear gets de niveles, profesores y estudiantes, con sus eventos y mierdas (copiando de los levels.component) 
      //this.serverService.getLevels()
    } else {
      this.isNew = true;
      this.playlist = new PlaylistDetail();
      this.formPlaylist = this.formBuilder.group({
        name: [this.playlist.title],
        enabled: [this.playlist.enabled]
      });
    }

  }

  getPlaylist(){
    this.subRefs$.push(
      this.serverService.getPlaylist(this.playlistId)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.playlist = res.body;
            this.formPlaylist = this.formBuilder.group({
              name: [this.playlist.title],
              enabled: [this.playlist.enabled]
            });
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
      )
    );
  }

  editPlaylist(){
    if(!this.isNew) {
      this.subRefs$.push(
        this.serverService.putClassRoom(this.playlistId, 
          { 
            name: this.formPlaylist.controls.name.value,
            description: this.formPlaylist.controls.description.value,
            enabled: this.playlist.enabled
          }
        ).subscribe(  res => {
          if (res.status === 200) {
            this.getPlaylist();
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
        )
      );
    } else {
      this.subRefs$.push(
        this.serverService.postClassRoom(
          { 
            name: this.formPlaylist.controls.name.value,
            description: this.formPlaylist.controls.description.value,
            enabled: this.playlist.enabled,
            studentsId: [],
            teachersId: []
          }
        ).subscribe(  res => {
          if (res.status === 200) {
            const currentUrl = '/#' + res.body.link;
            this.router.navigateByUrl(currentUrl).then(() => {
              window.location.reload();
            });
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
        )
      );
    }
  }

  addLevels() {
    const numbers = this.newLevels.trim().split(',')
        .filter(n => !Number(n))
        .map(n => parseInt(n));
    //valid guarda aquellos elementos que no sean numeros. Por lo que si valid.length > 0, hay ids que no son correctos.
    if (numbers.length > 0) {
      this.formLevels.controls['newLevels'].setErrors({'incorrect': true});
      alert("Debe indicar el identificador de la clase o clases, separado por comas.\n" +
      "Por ejemplo: 1,2,3");
    } else {
      this.subRefs$.push(
        this.serverService.addLevelsToPlaylist(this.playlistId, { levels: numbers })
        .subscribe(
          res => {
            if (res.status === 200) {
              this.formLevels.reset();
              this.getPlaylist();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
    }
    
  }

  deleteLevel(event: MouseEvent, levelId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de eliminar el nivel '+ levelId + ' de la clase?')) {
      this.subRefs$.push(
        this.serverService.deleteLevelsOfClass(this.playlistId, levelId)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.getPlaylist();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
    }
  }

  goLevel(levelId: string) {
    const currentUrl = '/#/levels/' + levelId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }

  goUser(userId: string) {
    const currentUrl = '/#/users/' + userId;
    this.router.navigateByUrl(currentUrl).then(() => {
      window.location.reload();
    });
  }
}
