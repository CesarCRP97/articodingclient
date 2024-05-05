
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassRoomDetail } from 'app/models/ClassRoomDetail';
import { ILevelWithImage } from 'app/models/ILevel';
import { IPage } from 'app/models/IPage';
import { IUser } from 'app/models/IUser';
import { ServerService } from 'app/server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clase-detail',
  templateUrl: './clase-detail.component.html'
})
export class ClaseDetailComponent implements OnInit {
  public subRefs$: Subscription[] = [];
  public classRoomId:number;
  public isNew = false;

  //Classroom contained element's forms and else
  public displayedLevels = ['id', 'title', 'active', 'actions'];
  public displayedUser = ['id','username','actions'];
  public classRoom: ClassRoomDetail;
  public formClassRoom: FormGroup;
  public formLevels: FormGroup;
  public formStudents: FormGroup;
  public formTeachers: FormGroup;

  //For bulk adding elements
  public newLevels: String;
  public newStudents: String;
  public newTeachers: String;

  public allLevelsColumns = ["id", "title", "owner", "likes", "timesPlayed", "actions"];
  public allLevels: ILevelWithImage[];
  public allLevelsPagination: PageEvent = new PageEvent();
  public allLevelsNameFilter: string;


  
  public allStudentsColumns = ["id","username","rol","actions"];
  public allStudents: IUser[];
  public allStudentsPagination: PageEvent = new PageEvent();
  public allStudentsNameFilter: string;
  
  public allTeachersColumns = ["id","username","rol","actions"];
  public allTeachers: IUser[];
  public allTeachersPagination: PageEvent = new PageEvent();
  public allTeachersNameFilter: string;


  public constructor(private formBuilder: FormBuilder,
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

      this.allLevelsPagination.pageIndex = 0;
      this.allLevelsPagination.pageSize = 5;
      this.allStudentsPagination.pageIndex = 0;
      this.allStudentsPagination.pageSize = 5;
      this.allTeachersPagination.pageIndex = 0;
      this.allTeachersPagination.pageSize = 5;

      const type: string = this.activateRoute['_routerState'].snapshot.url.split('/')[2];
      this.isNew = type === 'new';
      this.classRoomId = this.isNew ? undefined : parseInt(type);
    }

  public ngOnInit(): void {
    //3 getters de levels, students y teachers
    this.getLevels(this.allLevelsPagination);
    this.getTeachers(this.allTeachersPagination);
    this.getStudents(this.allStudentsPagination);

    if(!this.isNew) {
      this.getClassRoom();
    } else {
      this.classRoom = new ClassRoomDetail();
      this.formClassRoom = this.formBuilder.group({
        name: [this.classRoom.name],
        description: [this.classRoom.description],
        enabled: [this.classRoom.enabled]
      });
    }
  }

  public getClassRoom(){
    this.subRefs$.push(
      this.serverService.getClassRoom(this.classRoomId).subscribe(res => {
          if (res.status !== 200) {
            alert('Algo ha pasado... ' + res.status);
            return;
          }

          this.classRoom = res.body;
          this.formClassRoom = this.formBuilder.group({
            name: [this.classRoom.name],
            description: [this.classRoom.description],
            enabled: [this.classRoom.enabled]
          });
      }, err => alert(err.error.message))
    );
  }

  public editClassRoom(){
    if(!this.isNew) {
      this.subRefs$.push(
          this.serverService.putClassRoom(this.classRoomId,{ 
            name: this.formClassRoom.controls.name.value,
            description: this.formClassRoom.controls.description.value,
            enabled: this.classRoom.enabled
          }
        ).subscribe(  res => {
                if (res.status === 200) {
                  this.getClassRoom();
                } else alert('Algo ha pasado... ' + res.status);
              }, err => alert(err.error.message))
        );
    } else {
        this.subRefs$.push(
            this.serverService.postClassRoom({ 
                name: this.formClassRoom.controls.name.value,
                description: this.formClassRoom.controls.description.value,
                enabled: this.classRoom.enabled,
                studentsId: [],
                teachersId: []
            }).subscribe(  res => {
                if (res.status === 200) {
                    const currentUrl = '/#' + res.body.link;
                    this.router.navigateByUrl(currentUrl).then(() => {
                      window.location.reload();
                    });
                } else alert('Algo ha pasado... ' + res.status);
        }, err => alert(err.error.message))
      );
    }
  }

  /** LEVELS */

  public putAllLevelsFilter(): void {
    this.allLevelsPagination.pageIndex = 0;
    this.allLevelsPagination.pageSize = 5;

    this.getLevels(this.allLevelsPagination, this.allLevelsNameFilter === "" ? undefined : this.allLevelsNameFilter);
  }

  private getLevels(event: PageEvent, nameFilter?: string): void {
    this.allLevelsPagination = event;

    this.subRefs$.push(
      this.serverService.getLevels(
        this.allLevelsPagination.pageIndex,
        this.allLevelsPagination.pageSize, 
        null, null, 
        this.allLevelsNameFilter
      ).subscribe(res => {
            if (res.status !== 200) {
              alert('Algo ha pasado... ' + res.status);
              return;
            }
            const response: IPage<ILevelWithImage> = res.body;
            this.allLevels = response.content;
            this.allLevelsPagination.length = response.totalElements;
            this.allLevelsPagination.pageSize = response.pageable.pageSize;
            this.allLevelsPagination.pageIndex = response.pageable.pageNumber;
      }, err => alert(err.error.message))
    );
  }

  private addLevel(event: MouseEvent, levelId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de agregar el nivel '+ levelId + ' a la clase?')) {
      this.subRefs$.push(
          this.serverService.addLevelsToClass(this.classRoomId, { 'levels': [levelId]})
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

  addLevels() {
    const numbers = this.newLevels.trim().split(',')
        .filter(n => Number(n))
        .map(n => parseInt(n));
    if (numbers.length == 0) {
        this.formLevels.controls['newLevels'].setErrors({'incorrect': true});
        alert("Debe indicar el identificador de la clase o clases, separado por comas.\n" +
            "Por ejemplo: 1,2,3");
    } else {
      console.log(numbers);
      this.subRefs$.push(
          this.serverService.addLevelsToClass(this.classRoomId, { 'levels': numbers })
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

  /** TEACHERS ***/
  public putAllTeachersFilter(): void {
    this.allTeachersPagination.pageIndex = 0;
    this.allTeachersPagination.pageSize = 5;

    this.getLevels(this.allTeachersPagination, this.allTeachersNameFilter === "" ? undefined : this.allTeachersNameFilter);
  }

  private getTeachers(event: PageEvent, nameFilter?: string): void {
    this.allTeachersPagination  = event;

    this.subRefs$.push(
      this.serverService.getTeachers(
        this.allTeachersPagination.pageIndex,
        this.allTeachersPagination.pageSize,
      ).subscribe(res => {
            if (res.status !== 200) {
              alert('Algo ha pasado... ' + res.status);
              return;
            }
            const response: IPage<IUser> = res.body;
            this.allTeachers = response.content;
            this.allTeachersPagination.pageIndex = response.pageable.pageNumber;
            this.allTeachersPagination.pageSize = response.pageable.pageSize;
            this.allTeachersPagination.length = response.totalElements;
      }, err => alert(err.error.message))
    );
  }



  private addTeacher(event: MouseEvent, teacherId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de agregar el profesor '+ teacherId + ' a la clase?')) {
      this.subRefs$.push(
          this.serverService.addTeachersToClass(this.classRoomId, [teacherId])
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

  /** STUDENTS ***/

  public putAllStudentsFilter(): void {
    this.allStudentsPagination.pageIndex = 0;
    this.allStudentsPagination.pageSize = 5;

    this.getLevels(this.allStudentsPagination, this.allStudentsNameFilter === "" ? undefined : this.allStudentsNameFilter);
  }

  private getStudents(event: PageEvent, nameFilter?: string): void {
    this.allStudentsPagination  = event;

    this.subRefs$.push(
      this.serverService.getUsers(
        this.allStudentsPagination.pageIndex,
        this.allStudentsPagination.pageSize, 
        null, false, 
        this.allStudentsNameFilter
      ).subscribe(res => {
            if (res.status !== 200) {
              alert('Algo ha pasado... ' + res.status);
              return;
            }
            const response: IPage<IUser> = res.body;
            this.allStudents = response.content;
            this.allStudentsPagination.pageIndex = response.pageable.pageNumber;
            this.allStudentsPagination.pageSize = response.pageable.pageSize;
            this.allStudentsPagination.length = response.totalElements;
      }, err => alert(err.error.message))
    );
  }

  private addStudent(event: MouseEvent, studentId: string) {
    event.preventDefault();
    event.stopPropagation();
    if(confirm('¿Está seguro de agregar el profesor '+ studentId + ' a la clase?')) {
      this.subRefs$.push(
          this.serverService.addStudentsToClass(this.classRoomId, [studentId])
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
    return this.classRoom.levelsCompletedByUsers.some(level => level.userId === studentID && level.levelId === levelID);
  }

  private canTableBeDrawn(): boolean {
    return (this.classRoom.levels.length > 0 && this.classRoom.students.length > 0);
  }

  private isAlreadyInClassroom(levelId: number): boolean {
    return this.classRoom.levels.some(containedLevel => containedLevel.id === levelId);
  }
  private canBeAddedAsTeacher(teacherId: number, rol : string): boolean {
    return !this.classRoom.teachers.some(containedTeacher => containedTeacher.id === teacherId);
  }

  private canBeAddedAsStudent(studentId: number, rol : string): boolean {
    return (rol === 'ROLE_USER') && !this.classRoom.students.some(containedStudent => containedStudent.id === studentId);
  }
}
