import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import ValidationError from 'ajv/dist/runtime/validation_error';
import { ClassRoomDetail } from 'app/models/ClassRoomDetail';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clase-detail',
  templateUrl: './clase-detail.component.html'
})
export class ClaseDetailComponent implements OnInit {

  classRoomId:number;

  subRefs$: Subscription[] = [];

  classRoom: ClassRoomDetail;
  
  isNew = false;

  formClassRoom: FormGroup;
  
  formLevels: FormGroup;
  formStudents: FormGroup;
  formTeachers: FormGroup;

  newLevels: String;
  newStudents: String;
  newTeachers: String;

  displayedLevels = ['id', 'title', 'active', 'actions'];
  displayedUser = ['id','username','actions'];

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private serverService: ServerService,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute
    ) { 
      this.formLevels  =this.formBuilder.group({
        newLevels: [this.newLevels]});
      
      this.formStudents  =this.formBuilder.group({
      newStudents: [this.newStudents]});
    
      this.formTeachers  =this.formBuilder.group({
        newTeachers: [this.newTeachers]});
    }

  ngOnInit(): void {
    var type:string = this.activateRoute['_routerState'].snapshot.url.split('/')[2];

    if(type != 'new') {
      this.classRoomId = Number(type);
      this.getClassRoom();
    } else {
      this.isNew = true;
      this.classRoom = new ClassRoomDetail();
      this.formClassRoom = this.formBuilder.group({
        name: [this.classRoom.name],
        description: [this.classRoom.description],
        enabled: [this.classRoom.enabled]
      });
    }

  }

  getClassRoom(){
    this.subRefs$.push(
      this.serverService.getClassRoom(this.classRoomId)
      .subscribe(
        res => {
          if (res.status === 200) {
            this.classRoom = res.body;
            this.formClassRoom = this.formBuilder.group({
              name: [this.classRoom.name],
              description: [this.classRoom.description],
              enabled: [this.classRoom.enabled]
            });
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
      )
    );
  }

  editClassRoom(){
    if(!this.isNew) {
      this.subRefs$.push(
        this.serverService.putClassRoom(this.classRoomId, 
          { 
            name: this.formClassRoom.controls.name.value,
            description: this.formClassRoom.controls.description.value,
            enabled: this.classRoom.enabled
          }
        ).subscribe(  res => {
          if (res.status === 200) {
            this.getClassRoom();
          } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message)
        )
      );
    } else {
      this.subRefs$.push(
        this.serverService.postClassRoom(
          { 
            name: this.formClassRoom.controls.name.value,
            description: this.formClassRoom.controls.description.value,
            enabled: this.classRoom.enabled,
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
    var numbers: string[] = this.newLevels.trim().split(',');
    var valid = numbers.filter(n => !Number(n));
    if (valid.length > 0) {
      this.formLevels.controls['newLevels'].setErrors({'incorrect': true});
      alert("Debe indicar el identificador de la clase o clases, separado por comas.\n" +
      "Por ejemplo: 1,2,3");
    } else {
      var ids: object[] = numbers.map(n => {return {id : n}});
      this.subRefs$.push(
        this.serverService.addLevelsToClass(this.classRoomId, ids)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.formLevels.reset();
              this.getClassRoom();
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
        this.serverService.deleteLevelsOfClass(this.classRoomId, levelId)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.getClassRoom();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
    }
  }

  addTeachers() {
    var ids: string[] = this.newTeachers.trim().split(',');
      this.subRefs$.push(
        this.serverService.addTeachersToClass(this.classRoomId, ids)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.formTeachers.reset();
              this.getClassRoom();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
  }

  deleteTeacher(event: MouseEvent,teacherId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de eliminar el profesor '+ teacherId + ' de la clase?')) {
      this.subRefs$.push(
        this.serverService.deleteTeacherOfClass(this.classRoomId, teacherId)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.getClassRoom();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
    }
  }

  addStudents() {
    var ids: string[] = this.newStudents.trim().split(',');
      this.subRefs$.push(
        this.serverService.addStudentsToClass(this.classRoomId, ids)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.formStudents.reset();
              this.getClassRoom();
            } else alert('Algo ha pasado... ' + res.status);
          }, err => alert(err.error.message)
        )
      );
  }
  
  deleteStudent(event: MouseEvent,studentId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de eliminar el alumno '+ studentId + ' de la clase?')) {
      this.subRefs$.push(
        this.serverService.deleteStudentOfClass(this.classRoomId, studentId)
        .subscribe(
          res => {
            if (res.status === 200) {
              this.getClassRoom();
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

  levelBeenCompletedByStudent(studentID: number, levelID: number): boolean {
    let listCompleted = this.classRoom.levelsCompletedByUsers;
    if(listCompleted.find((level) => level.user.id === studentID && level.level.id === levelID) !== undefined) {
      return false;
    } else {
      return true;
    }
  }
}
