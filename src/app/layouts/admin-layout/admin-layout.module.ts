import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatSortModule } from "@angular/material/sort";
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { UsersComponent } from 'app/components/users/users.component';
import { LevelsComponent } from 'app/components/levels/levels.component';
import { ClassesComponent } from 'app/components/classes/classes.component';
import { ServerService } from 'app/server.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { JwtInterceptor } from 'app/JwtInterceptor';
import { CreateUserComponent } from 'app/components/users/create-user/create-user.component';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs'
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserDetailComponent } from 'app/components/users/user-detail/user-detail.component';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { ConfirmDialogComponent } from 'app/components/confirm-dialog/confirm-dialog.component';
import { LevelDetailComponent } from 'app/components/levels/level-detail/level-detail.component';
import { ClaseDetailComponent } from 'app/components/classes/clase-detail/clase-detail.component';
import { LoadingService } from 'app/LoadingService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  declarations: [
    UsersComponent,
    UserDetailComponent,
    CreateUserComponent,
    LevelsComponent,
    LevelDetailComponent,
    ClassesComponent,
    ClaseDetailComponent
    
  ],
  providers: [    
    ServerService,

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
    
  ]
})

export class AdminLayoutModule {}
